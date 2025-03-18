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
  email: string,
  password: string,
  passwordConfirm: string,
  username: string,
}

export interface LoginData {
  username:string,
  password: string
}