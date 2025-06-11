
export interface TextSegment {
  content: string;
  color?: 'green' | 'red' | 'black'; // Added 'black' for clarity, though it's default
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
            { content: "<b>Outside:</b>", color: 'black' },
            { content: "✅ When you leave the house, simply pull the door closed without further locking", color: 'green' },
            { content: "✅ When you return, simply use your key on the top lock to gain entry", color: 'green' },
            { content: "⛔ Do not use the bottom lock at all!", color: 'red' }
          ],
          image: "/images/instructions/front-door-keypad.jpg",
          dataAiHint: "keypad door",
        },
        {
          textSegments: [ // Ensured this is an array
            { content: "<b>Inside:</b>", color: 'black' },
            { content: "⛔ Please never bolt the door or use the safety catch when inside the house", color: 'red' },
            { content: "❗<b>This will mean that the host cannot get into the house!</b>", color: 'black' }
          ],
          image: "/CANVALOCKS.gif", // Assuming this file exists in public, otherwise use /CANVALOCKS.gif or placeholder
          dataAiHint: "door lock",
        },
      ],
    },
    linkIconEmoji: "🔑",
  },
  "living-room-tv": {
    defaultTexts: {
      title: "Living Room TV",
      steps: [
        {
          textSegments: [
            { content: "1️⃣ Use the top-left button on the main TV remote to turn the TV on/off." }
          ],
          image: "https://placehold.co/370x550.png",
          dataAiHint: "tv remote",
        },
        {
          textSegments: [
            { content: "2️⃣ The 'Source' button on the main TV remote changes input (HDMI1 for Apple TV, HDMI2 for Chromecast)." }
          ],
          image: "https://placehold.co/370x550.png",
          dataAiHint: "remote source",
        },
        {
          textSegments: [
            { content: "3️⃣ Volume controls are on the main TV remote. ", color: 'green' },
            { content: "✅ The Apple TV remote controls the Apple TV interface.", color: 'green' }
          ],
          image: "https://placehold.co/370x550.png",
          dataAiHint: "apple tv",
        },
      ],
    },
    linkIconEmoji: "📺",
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
