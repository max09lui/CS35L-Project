# Web Messaging Application

###### Ethan Hopkins, Isaac Pinto, Michael Lui, Victoria Yu
###### 6 December 2023

## Introduction

This group project was created as the final submission for
CS35L in Fall of 2023. It is a full stack messaging app that
allows users to create profiles with a profile picture and bio, add/remove friends via a simple request system, and chat with their friends in real-time.

## Table of Contents

- [Basic Requirements](#basic-requirements)
- [Three Distinct Features](#three-distinct-features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Usage](#usage)


## Basic Requirements

**Dynamic Data**: Several aspects of our webapp involves the display of dynamic data. This includes a user's profile picture/bio, the pending and incoming friend requests of a user, the user's friends, and the chat history between a user and their friends

**Uploading Data**: Users can upload custom bios and profile pictures to customise their profile (which is viewable by other users). Additionally, messages sent in the client are stored in the server.

**Searching Through Server-Side Data**: In order to display a user's profile, or the chat history between two users, the webapp must search through the server's data and retrieve the appropriate profile data/messages to the client.

**Security Features**: The application requires a username/password registration/login to access the app. Users will be automatically redirected to the login page if the browser detects that they are not logged in.

## Three Distinct Features

**Messaging**: Being a messaging app, the first distinct feature is the ability to send/receive messages in real time. These messages are displayed with the user's name, with appropriate styling based on sender/user like in a real messaging app

**Friends**: Related to messaging is the ability to manage and change a list of friends. Users are able to send requests to other users, and are able to view a list of incoming requests from other users. Using this list, users are able to accept/deny these requests. Users are also able to view their pending (outgoing) friend requests, and cancel them. Additionally, users can decide to remove a friend at a later time if they are already friends. There is also checks to ensure users cannot add themselves or add someone they are already friends with

**Profiles**: Lastly, users have custom profiles which can be viewed by their friends in the 'friends' tab. This profile will display a custom bio, and profile picture which is stored as dynamic data.

## Getting Started

Follow these instructions to get the Web Chat Application up and running on your local machine.

### Prerequisites
- [Node.js](https://nodejs.org/en/download/)
- [MongoDB](https://www.mongodb.com/try/download/community)

### Installation

1. **Node.js Dependencies:**
   - Once Node.js has been installed, run the following commands in both the 'client' and 'server' directories to download the necessary dependencies:
     ```bash
     npm install
     ```

2. **MongoDB:**
   - If MongoDB is not already installed, download and install it from [MongoDB Community Server](https://www.mongodb.com/try/download/community).
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and set up an account.
   - Create a cluster and obtain the MongoDB connection URI from the cluster settings.
   
3. **Configure MongoDB URI:**
   - In the 'server' directory, create a `.env` file.
   - Add the following line to the `.env` file, replacing `<your-mongodb-uri>` with your actual MongoDB URI:
     ```plaintext
     MONGODB_URI=<your-mongodb-uri>
     ```
   - Save the `.env` file.

### Running the Application

In both the 'client' and 'server' directories, run 'npm run start' to run both the client and server respectively. The webapp should open in your browser.

## Usage

**Log In**: Users must register a username/password, and then log in to use the app.

**Navigation**: Users are able to navigate the app and log out using the navigation bar at the top of the page.

**Profile**: Users can set a custom bio as well as uploading an image URL for their profile picture in the 'profile' tab.

**Friends**: To start chatting with other users, users must first add some friends. Users are able to do this in the 'friends' tab, and will be able to view their pending (outgoing) friend requests. In this tab, users can also accept/deny incoming friend requests, as well as view the profile of their friends.

**Chats**: In the 'chat' tab, users are able to message any of their friends.
