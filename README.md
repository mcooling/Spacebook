# Spacebook React Native Project

This is the Spacebook React Native Project for the DTS Year 4 Mobile App Development module.

The GitHub repository can be found here https://github.com/mcooling/Spacebook

For queries, please contact Marc Cooling (marc.cooling@stu.mmu.ac.uk).

## ESLint Configuration
ESLint has been configured with the AirBnB style guide for this project, in conjunction with the
Prettier plugin.

Configuration settings have been added in the .eslintrc.js and .prettierrc config files

##Running The App
`npm start` or `expo start` launches the app in browser mode.

Use commands -i or -a to launch in Android or iOS (you will need to have Android Emulator or
iOS Simulator configured locally).

`npm run dev` launches the server side code, listening on port 3333.

##Alert Functionality
Example alert functionality has been added, to Login & Signup screens. Because React Native Alert() is unsupported
on Expo web, the AwesomeAlerts library has been used.

https://www.npmjs.com/package/react-native-awesome-alerts

