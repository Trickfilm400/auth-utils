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

- expose middleware for checked if logged in
- check if user has session / key which is authenticated (logged in via SSO)
- expose function to check if user has permission (probably use library and expose check method)
  - e. g. asterisk-perm: `check("user:read"): boolean`
- expose SSO paths (/login, /logout, /callback)
  - to handle oidc/oauth2/saml authentications
  - select which you cant to have implemented
- parameters for library on initialisation in project
  - express-app, existing DB? variables for SSO (or/and DB)
- implement
  - custom permission management by SSO users
    - create custom permission for SSO user
    - e. g. `ytdl:download, ytdl:*` or so
  - create this permission system für database
    - own(?!) DB table / collection
    - some small kind of user management
    - expose rest paths for managing permissions
    - create custom permissions in db
      - ensurePermission(name)
      - will be checked on startup if exist in DB