/**
 * Use this interface to define the user entity for the database
 * @version 1
 * @since 20.06.2023
 * @author Nico W.
 */
export interface IUserDBTemplate {
  //user identifier of Identity Provider
  sso_user_id: string;
  //first name
  sso_user_first_name: string;
  //last name
  sso_user_last_name: string;
  //user email
  sso_user_email: string;
}
