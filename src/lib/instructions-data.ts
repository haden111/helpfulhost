
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
            { content: " When you come back inside, please close the door and pull the handle upwards and it will automatically lock" }
          ],
          image: "/uparrow.gif",
          dataAiHint:  "Pull to lock",
        },
      ],
    },
    linkIconEmoji: "🏡",
  },
  "kitchen-coffee-machine": {
    defaultTexts: {
      title: "Kitchen Coffee Machine",
      steps: [
        {
          textSegments: [
            { content: "Ensure the water tank at the back is filled with fresh water. 🚰" }
          ],
          image: "https://placehold.co/370x550.png",
          dataAiHint: "water tank",
        },
        {
          textSegments: [
            { content: "Lift the handle, place a coffee pod in the slot, and firmly close the handle." }
          ],
          image: "https://placehold.co/370x550.png",
          dataAiHint: "coffee pod",
        },
        {
          textSegments: [
            { content: "Select your desired coffee size (small or large cup icon) and press the button to brew." }
          ],
          image: "https://placehold.co/370x550.png",
          dataAiHint: "brew button",
        },
        {
          textSegments: [
            { content: "⛔ Do not open the handle during brewing cycle.", color: 'red' }
          ],
          image: "https://placehold.co/370x550.png",
          dataAiHint: "warning sign",
        }
      ],
    },
    linkIconEmoji: "☕",
  },
};
