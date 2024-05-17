import { PlatformWithIdentifiers } from "../services/socialMedia/models";

export const mockPlatforms: PlatformWithIdentifiers[] = [
  {
    id: "1",
    name: "Instagram",
    exampleIdentifier: "@example_insta",
    identifiers: [
      { id: "1-1", identifier: "@john_doe" },
      { id: "1-2", identifier: "@jane_doe" },
    ],
  },
  {
    id: "2",
    name: "Twitter",
    exampleIdentifier: "@example_twitter",
    identifiers: [
      { id: "2-1", identifier: "@john_smith" },
      { id: "2-2", identifier: "@jane_smith" },
    ],
  },
];
