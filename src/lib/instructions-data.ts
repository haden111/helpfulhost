
export interface StepInstruction {
  text: string;
  image: string;
  dataAiHint: string;
}

export interface InstructionLocation {
  defaultTexts: {
    title: string;
    steps: StepInstruction[];
  };
  image: string; // Main image for the location
  dataAiHint: string; // AI hint for the main image
}

export const instructionsData: Record<string, InstructionLocation> = {
  "front-door": {
    defaultTexts: {
      title: "Front Door Instructions",
      steps: [
        {
          text: "To unlock the door, enter the code: 1234.",
          image: "https://placehold.co/300x200.png",
          dataAiHint: "keypad door",
        },
        {
          text: "To lock the door, press the Schlage button once.",
          image: "https://placehold.co/300x200.png",
          dataAiHint: "door lock",
        },
      ],
    },
    image: "https://placehold.co/600x400.png", // Main location image
    dataAiHint: "door entrance",
  },
  "living-room-tv": {
    defaultTexts: {
      title: "Living Room TV Instructions",
      steps: [
        {
          text: "Use the top-left button on the main TV remote to turn the TV on/off.",
          image: "https://placehold.co/300x200.png",
          dataAiHint: "tv remote",
        },
        {
          text: "The 'Source' button on the main TV remote changes input (HDMI1 for Apple TV, HDMI2 for Chromecast).",
          image: "https://placehold.co/300x200.png",
          dataAiHint: "remote source",
        },
        {
          text: "Volume controls are on the main TV remote. The Apple TV remote controls the Apple TV interface.",
          image: "https://placehold.co/300x200.png",
          dataAiHint: "apple tv",
        },
      ],
    },
    image: "https://placehold.co/600x400.png", // Main location image
    dataAiHint: "television remote",
  },
  "kitchen-coffee-machine": {
    defaultTexts: {
      title: "Kitchen Coffee Machine Instructions",
      steps: [
        {
          text: "Ensure the water tank at the back is filled with fresh water.",
          image: "https://placehold.co/300x200.png",
          dataAiHint: "water tank",
        },
        {
          text: "Lift the handle, place a coffee pod in the slot, and firmly close the handle.",
          image: "https://placehold.co/300x200.png",
          dataAiHint: "coffee pod",
        },
        {
          text: "Select your desired coffee size (small or large cup icon) and press the button to brew.",
          image: "https://placehold.co/300x200.png",
          dataAiHint: "brew button",
        },
      ],
    },
    image: "https://placehold.co/600x400.png", // Main location image
    dataAiHint: "coffee maker",
  },
};
