const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  user_name: state => state.user.user_name,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes
}
export default getters
