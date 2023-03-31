# 

2022
Created with ♥ by [typescript-project-scaffolding](https://github.com/Trickfilm400/typescript-project-scaffolding)





<!--
auth wrapper package??

internal / external roles?

e. g.: admin role fetch from SSO session, detailed permission inside project

-->

=======================

Concept

=======================

- [x] expose middleware for checked if logged in
- [x] check if user has session / key which is authenticated (logged in via SSO) => `checkLoggedIn()` Middleware
- [ ] expose function to check if user has permission (probably use library and expose check method)
  - [ ] e. g. asterisk-perm: `check("user:read"): boolean`
- [x] expose SSO paths (/login, /logout, /callback)
  - [ ] to handle oidc/oauth2/saml authentications
  - [ ] select which you cant to have implemented
- [x] parameters for library on initialisation in project
  - [x] _express-app_, **existing DB**? _variables for SSO_ (or/and DB)
  - [ ] DB missing currently
- [ ] implement
  - [ ] custom permission management by SSO users
    - [ ] create custom permission for SSO user
    - [ ] e. g. `ytdl:download, ytdl:*` or so
  - [ ] create this permission system für database
    - [ ] own(?!) DB table / collection
    - [ ] some small kind of user management
    - [ ] expose rest paths for managing permissions
    - [ ] create custom permissions in db
      - [ ] ensurePermission(name)
      - [ ] will be checked on startup if exist in DB
- [ ] create routes for user management and permission management
  - [ ] create routes for user management
    - [ ] create user
    - [ ] delete user
    - [ ] update user
    - [ ] get user
    - [ ] get all users
  - [ ] create routes for permission management
    - [ ] create permission
    - [ ] delete permission
    - [ ] update permission
    - [ ] get permission
    - [ ] get all permissions
  - [ ] OPENAPI SCHEMA!!!!!!!!!]
  - [ ] ADD ROUTES WITH ABSTRACT CLASSES ETC.