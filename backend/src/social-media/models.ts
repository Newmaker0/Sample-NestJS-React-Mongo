export interface Identifier {
  id: string;
  identifier: string;
}

export interface Platform {
  id: string;
  name: string;
  exampleIdentifier: string;
}

export interface PlatformWithIdentifiers {
  id: string;
  name: string;
  exampleIdentifier: string;
  identifiers: Identifier[];
}
