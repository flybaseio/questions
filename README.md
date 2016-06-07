# Questions

## Introduction

Real-time Question system with Flybase.io

This is in two parts, first you have the actual question area for people to enter questions, and upvote questions they like best, and second you have the dashboard where you can view questions as they come in and watch as the votes change.

Two handy things about making this real-time:

Viewers can see questions move up the voting line as they are upvoted
You can watch questions appear and get upvoted from the dashboard

## Asking Questions

First, make sure you have a [flybase](https://app.flybase.io/signup) account.

In an editor, open `app.js` and change these lines:

```javascript
		.constant('FLYBASE_CONFIG',{
			API_KEY:"YOUR-API-KEY",
			DB_NAME:'questions'
		})
```

So that `YOUR-API-KEY` is set to your API key inside your account, and set the `DB_NAME` to whatever you named your app.

## Setting up the dashboard

Let's set up the dashboard,

In an editor, open `dashboard/app.js` and change these lines:

```javascript
		.constant('FLYBASE_CONFIG',{
			API_KEY:"YOUR-API-KEY",
			DB_NAME:'questions'
		})
```

So that `YOUR-API-KEY` is set to your API key inside your account, and set the `DB_NAME` to whatever you named your app.

You can run your dashboard anywhere, even locally and it doesn't have to be installed where you install your question site.
