# Tweet Deletion Script

This JavaScript script automates the process of deleting tweets from your Twitter account by interacting with the page's DOM and programmatically clicking the necessary buttons. It is designed to work efficiently by handling dynamic content and providing robust error handling.

## Features

- **Automated Tweet Deletion**: The script finds and clicks the "Delete" option for each tweet on your timeline.
- **Unretweet Support**: Handles unretweeting in case the tweet was retweeted instead of posted by you.
- **Real-Time Processing**: Uses a loop to continuously process tweets as they appear, ensuring all tweets get deleted even if they load dynamically.
- **Logging for Debugging**: Outputs logs to the console for each action, helping to trace the script's operation and detect any errors.
- **Delay Handling**: Introduces slight delays between actions to ensure reliability without being too slow.

## How It Works

1. The script identifies all tweets on the page by selecting buttons associated with each tweet's caret (the options button).
2. For each tweet:
   - It opens the tweet options menu by clicking the caret.
   - Selects the "Delete" option if available.
   - Confirms the deletion in the confirmation dialog.
3. If the tweet was retweeted, it handles the unretweet process similarly, confirming the unretweet action.
4. The script continuously processes tweets until no more delete buttons are found.

## Prerequisites

- **Browser Console**: This script is intended to be run directly in your browser's developer console.
  - To open the console, press `F12` or `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (macOS), then navigate to the "Console" tab.

## Usage

1. Open Twitter in your browser and navigate to your timeline or profile page where the tweets you want to delete are located.
2. Open the browser's console (see instructions above).
3. Copy and paste the following code into the console:

   ```javascript
   const deleteAllTweets = async () => {
     const processedButtons = new Set();
     const getDeleteButtons = () => Array.from(document.querySelectorAll('[data-testid="tweet"] [data-testid="caret"]'));
     const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

     const clickButton = async (button, description) => {
       if (!button) return false;
       console.log(`Attempting to click: ${description}`);
       button.click();
       await delay(100);
       return true;
     };

     const processDeleteButtons = async () => {
       const deleteButtons = getDeleteButtons().filter(button => !processedButtons.has(button));
       if (deleteButtons.length === 0) return false;

       for (const button of deleteButtons) {
         processedButtons.add(button);
         const clicked = await clickButton(button, "Caret button");
         if (!clicked) continue;

         await delay(100);

         const menuItems = Array.from(document.querySelectorAll('[role="menuitem"]'));
         const deleteOption = menuItems.find(item => item.textContent === 'Delete');

         if (deleteOption) {
           const clickedDelete = await clickButton(deleteOption, "Delete option");
           if (!clickedDelete) continue;

           await delay(100);
           const confirmationButton = document.querySelector('[data-testid="confirmationSheetConfirm"]');
           const clickedConfirm = await clickButton(confirmationButton, "Confirmation button");
         } else {
           const tweetContainer = button.closest('[data-testid="tweet"]');
           const unretweetButton = tweetContainer?.querySelector('[data-testid="unretweet"]');
           if (unretweetButton) {
             const clickedUnretweet = await clickButton(unretweetButton, "Unretweet button");
             if (!clickedUnretweet) continue;

             await delay(100);
             const unretweetConfirmButton = document.querySelector('[data-testid="unretweetConfirm"]');
             const clickedUnretweetConfirm = await clickButton(unretweetConfirmButton, "Unretweet confirmation button");
           }
         }
       }
       return true;
     };

     while (await processDeleteButtons()) {
       console.log("Processed a batch of tweets, checking for more...");
       await delay(1000);
     }

     console.log('All tweets processed successfully!');
   };

   deleteAllTweets();
