export default chrome.runtime.onInstalled.addListener(() => {
  console.log("Background Service Worker working...");
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "side_panel") {
    chrome.windows.getCurrent((w) => {
      void chrome.sidePanel.open({ windowId: w.id! });
      console.log("Command/Ctrl + O triggered! :)");
    });
  }

  if (command === "reload") {
    chrome.runtime.reload();
    console.log("Command/Ctrl + E triggered! :)");
    console.log("Ctest! :)");
  }

  if (command === "open_popup") {
    void chrome.action.openPopup();
  }
});

chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  console.log("Message received:", message);
  if (message === "subscription-detected") {
    console.log("Opening popup due to trial text detection");
    void chrome.action.openPopup();
  }
});
