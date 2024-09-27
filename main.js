const deleteAllTweets = async () => {
  const processedButtons = new Set();
  const getDeleteButtons = () => Array.from(document.querySelectorAll('[data-testid="tweet"] [data-testid="caret"]'));
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Introduce a helper to reliably click a button
  const clickButton = async (button, description) => {
    if (!button) return false;
    console.log(`Attempting to click: ${description}`);
    button.click();
    await delay(100); // Short delay after each click
    return true;
  };

  const processDeleteButtons = async () => {
    const deleteButtons = getDeleteButtons().filter(button => !processedButtons.has(button));
    if (deleteButtons.length === 0) return false;

    for (const button of deleteButtons) {
      processedButtons.add(button);

      // Click on the caret to open the menu
      const clicked = await clickButton(button, "Caret button");
      if (!clicked) {
        console.error("Failed to click caret button.");
        continue;
      }

      await delay(100); // Give time for the menu to appear

      // Find the delete option in the menu
      const menuItems = Array.from(document.querySelectorAll('[role="menuitem"]'));
      const deleteOption = menuItems.find(item => item.textContent === 'Delete');

      if (deleteOption) {
        // Click the delete option
        const clickedDelete = await clickButton(deleteOption, "Delete option");
        if (!clickedDelete) {
          console.error("Failed to click delete option.");
          continue;
        }

        await delay(100); // Wait for confirmation dialog to appear

        // Click the confirmation button
        const confirmationButton = document.querySelector('[data-testid="confirmationSheetConfirm"]');
        const clickedConfirm = await clickButton(confirmationButton, "Confirmation button");
        if (!clickedConfirm) {
          console.error("Failed to click confirmation button.");
        }
      } else {
        // Handle the case of unretweeting
        const tweetContainer = button.closest('[data-testid="tweet"]');
        const unretweetButton = tweetContainer?.querySelector('[data-testid="unretweet"]');

        if (unretweetButton) {
          const clickedUnretweet = await clickButton(unretweetButton, "Unretweet button");
          if (!clickedUnretweet) {
            console.error("Failed to click unretweet button.");
            continue;
          }

          await delay(100); // Wait for confirmation dialog to appear

          // Click the confirmation button for unretweet
          const unretweetConfirmButton = document.querySelector('[data-testid="unretweetConfirm"]');
          const clickedUnretweetConfirm = await clickButton(unretweetConfirmButton, "Unretweet confirmation button");
          if (!clickedUnretweetConfirm) {
            console.error("Failed to click unretweet confirmation button.");
          }
        }
      }
    }

    return true;
  };

  // Loop to process buttons continuously until no more are found
  while (await processDeleteButtons()) {
    console.log("Processed a batch of tweets, checking for more...");
    await delay(1000); // Slight delay before retrying in case new tweets load dynamically
  }

  console.log('All tweets processed successfully!');
};

deleteAllTweets();
