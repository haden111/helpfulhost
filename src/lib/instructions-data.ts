
export interface StepInstruction {
  text: string;
  image: string; // URL for the step-specific image
  dataAiHint: string; // AI hint for the step-specific image
  textColor?: 'green' | 'red'; // Optional: for green or red text
}

export interface InstructionLocation {
  defaultTexts: {
    title: string;
    steps: StepInstruction[];
  };
  linkIconEmoji?: string; // Optional: Emoji to use for links to this POI
}

export const instructionsData: Record<string, InstructionLocation> = {
  "front-door": {
    defaultTexts: {
      title: "Front Door Instructions 🔑",
      steps: [
        {
          text: "To unlock the door, enter the code: 1234. ✅",
          // Assuming the user might have 'canva_370x550i.png' from an old version,
          // or '/images/instructions/front-door-keypad.jpg' which might not exist.
          // If user uploaded 'canva_370x550i.png' to public root, it should be '/canva_370x550i.png'.
          // If they have '/images/instructions/front-door-keypad.jpg' and it doesn't exist, this placeholder is safer.
          // The most robust fix if an invalid local path string (not starting with / or http) is present:
          image: "/images/instructions/front-door-keypad.jpg", // This was the last path provided by user. If it errors, the file likely doesn't exist.
                                                              // If the actual string in the user's file is "canva_370x550i.png", it should become "/canva_370x550i.png"
                                                              // For now, I'll keep what was last provided and remind user.
          dataAiHint: "keypad door",
          textColor: "green",
        },
        {
          text: "To lock the door, press the Schlage button once. ❗Ensure it's fully locked.",
          image: "https://placehold.co/370x550.png",
          dataAiHint: "door lock",
          textColor: "red",
        },
      ],
    },
    linkIconEmoji: "🔑",
  },
  "living-room-tv": {
    defaultTexts: {
      title: "Living Room TV Instructions 🎦",
      steps: [
        {
          text: "1️⃣ Use the top-left button on the main TV remote to turn the TV on/off.",
          image: "https://placehold.co/370x550.png",
          dataAiHint: "tv remote",
        },
        {
          text: "2️⃣ The 'Source' button on the main TV remote changes input (HDMI1 for Apple TV, HDMI2 for Chromecast).",
          image: "https://placehold.co/370x550.png",
          dataAiHint: "remote source",
        },
        {
          text: "3️⃣ Volume controls are on the main TV remote. ✅ The Apple TV remote controls the Apple TV interface.",
          image: "https://placehold.co/370x550.png",
          dataAiHint: "apple tv",
          textColor: "green",
        },
      ],
    },
    linkIconEmoji: "📺",
  },
  "kitchen-coffee-machine": {
    defaultTexts: {
      title: "Kitchen Coffee Machine Instructions ☕",
      steps: [
        {
          text: "Ensure the water tank at the back is filled with fresh water. 🚰",
          image: "https://placehold.co/370x550.png",
          dataAiHint: "water tank",
        },
        {
          text: "Lift the handle, place a coffee pod in the slot, and firmly close the handle.",
          image: "https://placehold.co/370x550.png",
          dataAiHint: "coffee pod",
        },
        {
          text: "Select your desired coffee size (small or large cup icon) and press the button to brew.",
          image: "https://placehold.co/370x550.png",
          dataAiHint: "brew button",
        },
        {
          text: "⛔ Do not open the handle during brewing cycle.",
          image: "https://placehold.co/370x550.png",
          dataAiHint: "warning sign",
          textColor: "red",
        }
      ],
    },
    linkIconEmoji: "☕",
  },
};
