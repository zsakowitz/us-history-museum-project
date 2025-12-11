// Do not treat anything here as being absolutely real. The text adventure format inherently guesses some lines which we have no evidence for, and is in no way intended to completely mimic the reality of the Haymarket affair.

// Scripts are named by perspective:
// - `def` => defendant
// - no other perspectives exist yet

import type { Ctx } from "../App"

export default async function (ctx: Ctx) {
    await defStart(ctx)
    await ctx.type`The game (and probably your life) is over.\n\nPlease note that most things in this text are not historically accurate, since the text adventure format inherently speculates about outcomes that did not happen -- otherwise it would be a very boring game.\n\nReload to let someone else play.`
}

async function defStart(ctx: Ctx) {
    await ctx.type`You have been accused of involvement with the bombing at Haymarket Square. We begin is the middle of your trial. Seven other accused anarchists are also here, alongside you.\n\nThe judge asks, "how do you plead?"\n\nPress Q, W, or A on this device's PHYSICAL KEYBOARD to select an option.`

    await ctx.switch({
        async Innocent(ctx) {
            await ctx.type`The judge considers you for a moment, then moves on to ask the defendant next to you. He does not appear to like your answer.`
            await defProceedWithTrial(ctx)
        },
        async Guilty(ctx) {
            await ctx.type`“Take 'em away!” the judge shouts. Policemen arrive and quickly haul you off to jail. Your fellow defendants huddle together, worried about you. But don't worry -- you'll see them in jail soon enough.`
            await defGoToJail(ctx)
        },
        async "Flee the United States of America."(ctx) {
            await ctx.type`You've chosen the same option as Rudolf Schnaubelt, the police's lead suspect. Schnaubelt chose to flee the country on May 14 (although presumably not during a court trial) after it became clear he had been involved with the bombing. Congrats on not being executed!`
        },
    })
}

async function defProceedWithTrial(ctx: Ctx) {
    await ctx.type`The other defendants also claim innocence.\n\nThe police start their side of the show, and bring out some evidence which they claim proves you guilty. The jurors look pretty convinced, and one of them looks at you with an almost disappointed face, as if to ask, "why would you do this?"\n\nNothing the police bring out looks like it was actually from the event.`

    await ctx.switch({
        async "Calmly let the police finish."(ctx) {
            await ctx.type`You let the police finish their presentation. Five jurors are now giving you looks of intense rage. The judge permits you to present your side of the case, but already seems convinced.\n\nWhat do you say?`
            await defFakeEv(ctx)
        },
        async "Tell the judge the evidence looks fake."(ctx) {
            await ctx.type`You shout "objection!" The judge seemed interested in the police's evidence, and now turns, slightly angry, to look at you. "Yes?" he says.\n\nWhat precisely do you say?`
            await defFakeEv(ctx)
        },
    })
}

async function defFakeEv(ctx: Ctx) {
    await ctx.switch({
        "Those bombs look completely fake!": defClaimFakeBombs,
        "I've never seen those bombs in my life!": defNeverSeenThoseBombs,
        "The police's evidence is falsified.": defClaimPoliceFalseEv,
    })
}

async function defClaimFakeBombs(ctx: Ctx) {
    await ctx.type`"Oh, so you know what a real bomb looks like?" the judge shouts. "Sounds like the work of an anarchist to me!" The jury asks to convene.`
    await ctx.switch({
        "..."() {},
        async "Don't I get a chance to present my case?"(ctx) {
            await ctx.type`"Didn't you hear the jury?" the judge yells. "Quiet down or I'll have you jailed for disrupting court order!"`
        },
    })
    await defWaitForJury(ctx)
}

async function defClaimPoliceFalseEv(ctx: Ctx) {
    await ctx.type`"Are you accusing our government officials, who are sworn to uphold truth, fairness, and justice, of falsifying evidence?" the lawyer from the police responds.\n\nThe jury stares in shock at your claim -- surely the police would never do such a thing.`
    await ctx.switch({
        async "Yes."(ctx) {
            await ctx.type`"Why, that is simply a preposterous claim!" the lawyer states. "Police are here to protect the law, the people, and the state, and they would certainly never falsify evidence against you.\n\n"If your only reason for being innocent is that the police's evidence is wrong, you definitely feel convicted by the rest of the police. Off with your head!"`
            await ctx.type`You try to say that the lawyer is being unnecessarily reductive and even sounds a bit violent themselves, but the jury have already asked to convene.`
            await defWaitForJury(ctx)
        },
        async "No."(ctx) {
            await ctx.type`"Then what are you accusing them of? Sounds like you're just trying to waste our time, which clearly proves you know you'll be sentenced eventually. Take 'em away, boys!"\n\nThe lawyer does not have authority over the jailers, but the jury does ask to convene, in light of the lawyer's convincing argument.`
            await defWaitForJury(ctx)
        },
    })
}

async function defWaitForJury(ctx: Ctx) {
    await ctx.type`You wait for the jury to return. They hand a piece of paper to the judge. The judge reads it aloud.\n\n"[player full name], the jury hereby sentences to being executed for the crime of building bombs and assisting in the deaths of tens of policemen."`
    await ctx.switch({
        "..."() {},
        async "Weren't there only seven policemen killed?"(ctx) {
            await ctx.type`"I am sure the jury did their fact-checking." states the judge, calmly, now that he's about to be done with you. "They're sworn under oath not to lie, after all."`
        },
    })
    await ctx.type`Jailers arrive to bring you to jail. You swear one of the policemen gives a self-satisfactory smile at you, a tiny expression of mocking. The judge is staring the that policeman, but doesn't seem to care.`
    await defGoToJail(ctx)
}

async function defNeverSeenThoseBombs(ctx: Ctx) {
    await ctx.type`"Nobody ever said those were bombs." one of the policeman says. "How did you recognize them as bombs so quickly?"`
    await ctx.switch({
        async "Everybody knows what a bomb looks like."(ctx) {
            await ctx.type`The jurors look shocked. The lawyer for the police states, "That is obviously false, since not everybody has interacted with a bomb in their lifetime. You clearly know more about bombs than anyone else here, which therefore identifies you as the bomber, or at least involved in its creation!"\n\nYou are apalled that the lawyer would make such a generalization with no evidence.\n\nThe jury asks to convene.`
            await defWaitForJury(ctx)
        },
        async "Lucky guess."(ctx) {
            await ctx.type`"See how the defendant makes a mockery of our courtroom!" the police lawyer responds. "A lucky guess is clearly not how they recognize part of our evidence as a bomb -- they were obviously aware of it being a bomb because they made it! Jury, this is obviously one of the perpetrators."\n\nThe jury asks to convene.`
            await defWaitForJury(ctx)
        },
    })
}

// seven paths from def, five go through here
async function defGoToJail(ctx: Ctx) {
    await ctx.type`A few days later, you are now in jail. Six of the other suspects are here as well, most of them (and you) with an execution scheduled sometime in the near future.\n\nThe governor of Illinois has offered to commute your sentence (i.e. reduce it) to a life sentence, in exchange for your admission of guilt.\n\nDo you take the offer?`
    await ctx.switch({
        async "No, I'm not guilty."(ctx) {
            await ctx.type`You stick to the story that you were never involved with the bombing -- it's probably the truth, after all, and maybe the governor is trying to trick you. Honestly, who knows.`
            await ctx.type`A while later, one of your jailmates shoots himself to avoid execution. The next day, you and your fellow anarchists are sent to be hanged.\n\nWhat do you do?`
            await ctx.switch({
                async "Flee the United States."(ctx) {
                    await ctx.type`You try to flee the United States, but quickly realize that there is a noose around your throat and that it's very hard to run in such circumstances.\n\nChoose an alternative route.`
                    await ctx.switch({
                        "Accept your death.": defDie,
                        "Make a quotable statement before your death.": defQuotable,
                    })
                },
                "Accept your death.": defDie,
                "Make a quotable statement before your death.": defQuotable,
            })
        },
        async "Yes, I would like to live."(ctx) {
            await ctx.type`Even though you weren't involved with the bombing, you admit guilt to get out of the execution. The governor grants you a life sentence.\n\nCongrats on survival, although prison will likely be a miserable existence.\n\nServes you right, now that everybody knows for sure you killed those policemen.`
        },
    })
}

async function defDie(ctx: Ctx) {
    await ctx.type`You are hanged. Goodbye, policeman killer.`
}

async function defQuotable(ctx: Ctx) {
    await ctx.type`You must be August Spies. Before his death, Spies stated, "The time will come when our silence is more powerful than the voices you strangle today." Everybody else was hanged shortly after, possibly to avoid giving them any time to talk.`
    await ctx.type`You have been hanged. Rest in martyrdom, police killer.`
}
