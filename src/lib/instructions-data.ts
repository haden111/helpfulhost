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
    titleKey: "frontDoorWelcome",
    stepsKeys: ["frontDoorStep1", "frontDoorStep2", "frontDoorStep3"],
    defaultTexts: {
      title: "Welcome to Our Home!",
      steps: [
        "Please use the keypad to enter the code: 1234#.",
        "Turn the handle to the right to open.",
        "Make yourself comfortable!",
      ],
    },
    image: "https://placehold.co/600x400.png",
    dataAiHint: "door entrance",
  },
  "living-room-tv": {
    titleKey: "livingRoomTvGuide",
    stepsKeys: ["livingRoomTvStep1", "livingRoomTvStep2", "livingRoomTvStep3"],
    defaultTexts: {
      title: "TV Remote Guide",
      steps: [
        "Use the top-left button to turn the TV on/off.",
        "The 'Source' button changes input (HDMI1, HDMI2, etc.).",
        "Volume and channel controls are in the middle.",
      ],
    },
    image: "https://placehold.co/600x400.png",
    dataAiHint: "television remote",
  },
  "kitchen-coffee-machine": {
    titleKey: "kitchenCoffeeMachine",
    stepsKeys: ["coffeeMachineStep1", "coffeeMachineStep2", "coffeeMachineStep3"],
    defaultTexts: {
      title: "Coffee Machine Instructions",
      steps: [
        "Ensure the water tank is filled.",
        "Place a coffee pod in the designated slot.",
        "Select your desired coffee size and press start.",
      ],
    },
    image: "https://placehold.co/600x400.png",
    dataAiHint: "coffee maker",
  },
};
