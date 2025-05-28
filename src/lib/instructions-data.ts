
export interface InstructionLocation {
  titleKey: string; // Key for fetching original title, e.g., "welcomeTitle"
  stepsKeys: string[]; // Keys for fetching original steps
  defaultTexts: { // Default English texts for title and steps
    title: string;
    steps: string[];
  };
  image: string;
  dataAiHint: string;
}

export const instructionsData: Record<string, InstructionLocation> = {
  "front-door": {
    titleKey: "frontDoorInstructions",
    stepsKeys: ["frontDoorStep1", "frontDoorStep2"],
    defaultTexts: {
      title: "Front Door Instructions",
      steps: [
        "To unlock the door, enter the code: 1234.", // Removed the '#'
        "To lock the door, press the Schlage button once.",
      ],
    },
    image: "https://placehold.co/600x400.png",
    dataAiHint: "door entrance",
  },
  "living-room-tv": {
    titleKey: "livingRoomTvInstructions",
    stepsKeys: ["livingRoomTvStep1", "livingRoomTvStep2", "livingRoomTvStep3"],
    defaultTexts: {
      title: "Living Room TV Instructions",
      steps: [
        "Use the top-left button on the main TV remote to turn the TV on/off.",
        "The 'Source' button on the main TV remote changes input (HDMI1 for Apple TV, HDMI2 for Chromecast).",
        "Volume controls are on the main TV remote. The Apple TV remote controls the Apple TV interface.",
      ],
    },
    image: "https://placehold.co/600x400.png",
    dataAiHint: "television remote",
  },
  "kitchen-coffee-machine": {
    titleKey: "kitchenCoffeeMachineInstructions",
    stepsKeys: ["coffeeMachineStep1", "coffeeMachineStep2", "coffeeMachineStep3"],
    defaultTexts: {
      title: "Kitchen Coffee Machine Instructions",
      steps: [
        "Ensure the water tank at the back is filled with fresh water.",
        "Lift the handle, place a coffee pod in the slot, and firmly close the handle.",
        "Select your desired coffee size (small or large cup icon) and press the button to brew.",
      ],
    },
    image: "https://placehold.co/600x400.png",
    dataAiHint: "coffee maker",
  },
};
