(function () {
  var app_is_visible = true;
  var AppUi = Script.require("appUi");
  var dummy_variable = false;

  // Global vars
  var ac_tablet;
  var chat_overlay_window;

  startup();

  function startup() {
    ac_tablet = Tablet.getTablet("com.highfidelity.interface.tablet.system");

    var app_button = ac_tablet.addButton({
      icon: Script.resolvePath("./img/icon.png"),
      text: "crsh1"
    });

    // When script ends, remove itself from tablet
    Script.scriptEnding.connect(function () {
      ac_tablet.removeButton(app_button);
      chat_overlay_window.close();
    });

    if (!dummy_variable) {
      chat_overlay_window = new OverlayWebWindow({
        title: "crsh1",
        width: 350,
        height: 400,
        visible: app_is_visible,
        source: Script.resolvePath("./index.html")
      });
    } else {
      chat_overlay_window = new AppUi({
        buttonName: "crsh1",
        home: Script.resolvePath("./index.html"),
        graphicsDirectory: Script.resolvePath("./") // The path to your button icons
      });
    }

    // Overlay button toggle
    app_button.clicked.connect(toggleMainChatWindow);
    chat_overlay_window.closed.connect(toggleMainChatWindow);

    function toggleMainChatWindow() {
      app_is_visible = !app_is_visible;
      app_button.editProperties({ isActive: app_is_visible });
      chat_overlay_window.visible = app_is_visible;
    }
  }

  // Initialize default message subscriptions
  Messages.subscribe("chat");
  Messages.subscribe("system");

  // Add event listeners
  // FIXME: below needs to be changed to work with appui
  chat_overlay_window.webEventReceived.connect(onWebEventReceived);

  // function receivedMessage(channel, message) {}
  function onWebEventReceived(event) {
    console.log(event);
    event = JSON.parse(event);
    if (event.action === "change_to_true") {
      dummy_variable = true;
      chat_overlay_window.close();
    }
  }
})();
