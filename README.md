# Automation Whatsapp

Automation Whatsapp is an Android application built with React Native, designed to automate message handling on the Whatsapp platform. It can intercept and process incoming notifications on an Android device, and when a reply is made, it's logged into a MySQL database. The application is tested using Appium for automated testing.

## Features

- **Notification Monitoring**: The application monitors incoming Whatsapp notifications on the Android device.
- **Automated Response**: When a reply is sent to a Whatsapp message, the application logs the reply into a MySQL database.
- **Database Integration**: All message replies are stored in a MySQL database for future reference and analysis.

## Installation

To use the Automation Whatsapp application, follow these steps:

1. Clone this repository to your local machine.
2. Open the project in Android Studio or your preferred React Native development environment.
3. Build and run the application on your Android device.

## Testing

The Automation Whatsapp application is tested using Appium, an open-source automation tool for mobile app testing. To run the tests:

1. Install Appium and its dependencies.
2. Set up your test environment and configuration.
3. Run the Appium tests against the Automation Whatsapp application.

## Usage

1. Upon launching the application, grant the necessary permissions for it to access Whatsapp notifications.
2. The application will start monitoring incoming Whatsapp messages.
3. When you reply to a Whatsapp message, the reply will be logged into the configured MySQL database.

## Configuration

To configure the Automation Whatsapp application, follow these steps:

1. Open the application settings.
2. Ensure that the necessary permissions for accessing Whatsapp notifications are granted.
3. Specify the MySQL database connection details in the application settings.
4. Save the settings.

## Dependencies

The Automation Whatsapp application relies on the following dependencies:

- React Native framework for building the mobile application.
- Appium for automated testing.
- MySQL database for storing message reply data.
