export interface OpenSpaceRegisterData{
  name: string,
  latitude: number,
  longitude: number,
  district: string
}

export interface ToggleOpenSpaceResponse {
  toggleOpenspaceStatus: {
    openspace: {
      id: string;
      name: string;
      latitude: number;
      longitude: number;
      district: string;
      isActive: boolean;
    };
  };
}

export interface RegisterData {
  password: string,
  passwordConfirm: string,
  username: string,
  sessionId?: string | null;
  role?: string;
}

export interface LoginData {
  username:string,
  password: string
}
