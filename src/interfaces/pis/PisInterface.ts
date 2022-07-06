/**
 *
 * @interface ISessionPayload
 */

export interface ISessionPayload {
  meta: {
    session_id: string;
  };
  data?: any;
}
