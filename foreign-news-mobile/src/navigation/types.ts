export type RootStackParamList = {
  Main: undefined
  Auth: undefined
  Article: { id: string }
  CategoryArticles: { categoryId: string; categoryName: string }
}

export type MainTabParamList = {
  Home: undefined
  Categories: undefined
  Search: undefined
  SavedNews: undefined
  Profile: undefined
}

export type AuthStackParamList = {
  SignIn: undefined
  SignUp: undefined
  ForgotPassword: undefined
}
