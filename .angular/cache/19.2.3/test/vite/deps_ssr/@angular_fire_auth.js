import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  AUTH_ERROR_CODES_MAP_DO_NOT_USE_INTERNALLY,
  ActionCodeOperation,
  ActionCodeURL,
  Auth,
  AuthCredential,
  AuthInstances,
  AuthModule,
  EmailAuthCredential,
  EmailAuthProvider,
  FacebookAuthProvider,
  FactorId,
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthCredential,
  OAuthProvider,
  OperationType,
  PhoneAuthCredential,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  ProviderId,
  RecaptchaVerifier,
  SAMLAuthProvider,
  SignInMethod,
  TotpMultiFactorGenerator,
  TotpSecret,
  TwitterAuthProvider,
  applyActionCode,
  authInstance$,
  authState,
  beforeAuthStateChanged,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  browserSessionPersistence,
  checkActionCode,
  confirmPasswordReset,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  debugErrorMap,
  deleteUser,
  fetchSignInMethodsForEmail,
  getAdditionalUserInfo,
  getAuth,
  getIdToken,
  getIdTokenResult,
  getMultiFactorResolver,
  getRedirectResult,
  idToken,
  inMemoryPersistence,
  indexedDBLocalPersistence,
  initializeAuth,
  initializeRecaptchaConfig,
  isSignInWithEmailLink,
  linkWithCredential,
  linkWithPhoneNumber,
  linkWithPopup,
  linkWithRedirect,
  multiFactor,
  onAuthStateChanged,
  onIdTokenChanged,
  parseActionCodeURL,
  prodErrorMap,
  provideAuth,
  reauthenticateWithCredential,
  reauthenticateWithPhoneNumber,
  reauthenticateWithPopup,
  reauthenticateWithRedirect,
  reload,
  revokeAccessToken,
  sendEmailVerification,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  setPersistence,
  signInAnonymously,
  signInWithCredential,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signInWithPhoneNumber,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  unlink,
  updateCurrentUser,
  updateEmail,
  updatePassword,
  updatePhoneNumber,
  updateProfile,
  useDeviceLanguage,
  user,
  validatePassword,
  verifyBeforeUpdateEmail,
  verifyPasswordResetCode
} from "./chunk-CX6LQM7F.js";
import "./chunk-HKUWI46M.js";
import "./chunk-5HFBECCQ.js";
import "./chunk-UWF4CWSN.js";
import "./chunk-EJF4SFNG.js";
import "./chunk-2W3MNUWV.js";
import "./chunk-DFRHWMTS.js";
import "./chunk-OGIUALEI.js";
import "./chunk-7RL4FTI4.js";
import "./chunk-ANGF2IQY.js";
export {
  ActionCodeOperation,
  ActionCodeURL,
  Auth,
  AuthCredential,
  AUTH_ERROR_CODES_MAP_DO_NOT_USE_INTERNALLY as AuthErrorCodes,
  AuthInstances,
  AuthModule,
  EmailAuthCredential,
  EmailAuthProvider,
  FacebookAuthProvider,
  FactorId,
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthCredential,
  OAuthProvider,
  OperationType,
  PhoneAuthCredential,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  ProviderId,
  RecaptchaVerifier,
  SAMLAuthProvider,
  SignInMethod,
  TotpMultiFactorGenerator,
  TotpSecret,
  TwitterAuthProvider,
  applyActionCode,
  authInstance$,
  authState,
  beforeAuthStateChanged,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  browserSessionPersistence,
  checkActionCode,
  confirmPasswordReset,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  debugErrorMap,
  deleteUser,
  fetchSignInMethodsForEmail,
  getAdditionalUserInfo,
  getAuth,
  getIdToken,
  getIdTokenResult,
  getMultiFactorResolver,
  getRedirectResult,
  idToken,
  inMemoryPersistence,
  indexedDBLocalPersistence,
  initializeAuth,
  initializeRecaptchaConfig,
  isSignInWithEmailLink,
  linkWithCredential,
  linkWithPhoneNumber,
  linkWithPopup,
  linkWithRedirect,
  multiFactor,
  onAuthStateChanged,
  onIdTokenChanged,
  parseActionCodeURL,
  prodErrorMap,
  provideAuth,
  reauthenticateWithCredential,
  reauthenticateWithPhoneNumber,
  reauthenticateWithPopup,
  reauthenticateWithRedirect,
  reload,
  revokeAccessToken,
  sendEmailVerification,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  setPersistence,
  signInAnonymously,
  signInWithCredential,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signInWithPhoneNumber,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  unlink,
  updateCurrentUser,
  updateEmail,
  updatePassword,
  updatePhoneNumber,
  updateProfile,
  useDeviceLanguage,
  user,
  validatePassword,
  verifyBeforeUpdateEmail,
  verifyPasswordResetCode
};
