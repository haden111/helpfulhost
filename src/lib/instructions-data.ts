
export interface TextSegment {
  content: string;
  color?: 'green' | 'red' | 'black';
  bold?: boolean; // Added bold property
}

export interface StepInstruction {
  textSegments: TextSegment[];
  image: string;
  dataAiHint: string;
}

export interface InstructionLocation {
  defaultTexts: {
    title: string;
    steps: StepInstruction[];
  };
  linkIconEmoji?: string;
}

export const instructionsData: Record<string, InstructionLocation> = {
  "front-door": {
    defaultTexts: {
      title: "Front Door",
      steps: [
        {
          textSegments: [
            { content: "Outside:", color: 'black', bold: true },
            { content: "✅ When you leave the house, simply pull the door closed without further locking", color: 'green' },
            { content: "✅ When you return, simply use your key on the top lock to gain entry", color: 'green' },
            { content: "⛔ Do not use the bottom lock at all!", color: 'red' }
          ],
          image: "/canva_370x550i.png", // Ensure this path is correct
          dataAiHint: "keypad door",
        },
        {
          textSegments: [
            { content: "Inside:", color: 'black', bold: true },
            { content: "⛔ Please never bolt the door or use the safety catch when inside the house", color: 'red' },
            { content: "❗This will mean that the host cannot get into the house!", color: 'black' } // Ensure this is not bold
          ],
          image: "/CANVALOCKS.gif", // Ensure this path is correct or use placeholder
          dataAiHint: "door lock",
        },
      ],
    },
    linkIconEmoji: "🔑",
  },
  "back-door": {
    defaultTexts: {
      title: "Back Door",
      steps: [
        {
          textSegments: [
            { content: "Turn the knob counter-clockwise until you hear a beep, pull down on the door handle to open the door!", color: 'green' },
            { content: "❗ If you close the door, it will automatically lock itself after a short period,", color: 'red' }
          ],
          image: "/turningknob.gif",
          dataAiHint: "Turn the knob",
        },
        {
          textSegments: [
            { content: "When you come back inside, please close the door and pull the handle upwards and it will lock.", color: 'green' }
          ],
          image: "/uparrow.gif",
          dataAiHint:  "Pull to lock",
        },
      ],
    },
    linkIconEmoji: "🏡",
  },
  "kitchen": {
    defaultTexts: {
      title: "Kitchen",
      steps: [
        {
          textSegments: [
            { content: "Turn on the kitchen lights using the green flashing switch", color: 'green'  }
          ],
          image: "/kitchenlights.gif",
          dataAiHint: "kitchen lights",
        },
        {
          textSegments: [
            { content: "You are welcome to use the kitchen to store and make food during your stay. Please help yourself to tea and coffee!", color: 'black'  }
          ],
          image: "/LIGHTSON.png",
          dataAiHint: "Lights on",
        },
      ],
    },
    linkIconEmoji: "☕",
  },
  "bathroom": {
    defaultTexts: {
      title: "Bathroom",
      steps: [
        {
          textSegments: [
            { content: "If using the shower, please switch on the extractor fan and open the window to prevent steam build up", color: 'green' }
          ],
          image: "/toilet.png",
          dataAiHint: "Extractor Fan",
        }
      ],
    },
    linkIconEmoji: "🚿",
  },
  "coffee": {
    defaultTexts: {
      title: "Coffee Machine",
      steps: [
        {
          textSegments: [
            { content: "Confusingly, there are currently 2 coffee machinesin the kitchen, please use the Tassimo branded machine next to the oven/stove!", color: 'green' }
          ],
          image: "/done-min.png",
          dataAiHint: "Use the Tassimo machine",
        },
        {
          textSegments: [
            { content: "Even more confusingly, the coffee pods are over the other side of the kitchen next to the toaster!", color: 'green' }
          ],
          image: "/capsules-min.png",
          dataAiHint: "Coffee pods on other side of kitchen",
        },
        {
          textSegments: [
            { content: "First, check that there is water in the refill jug at the back of the coffee mahine.", color: 'green' }
          ],
          image: "/jug.png",
          dataAiHint: "Fill with water",
        },
        {
          textSegments: [
            { content: "Pull up the shiny chrome head to reveal the old capsule, replace with a new capsule in the same direction", color: 'green' }
          ],
          image: "/addcapsule-min.png",
          dataAiHint: "Add the capsule",
        }
      ],
    },
    linkIconEmoji: "☕️",
  },
};
