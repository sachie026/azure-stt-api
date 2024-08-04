const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));


// Sample HTML content
const htmlTemplate = (skey, endpoint, akey, dep) => `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Talking Avatar Chat Demo</title>
    <link href="./css/styles.css" rel="stylesheet">
    <script src="https://aka.ms/csspeech/jsbrowserpackageraw"></script>
    <script src="./js/chat.js"></script>
</head>
<body>
<h1>Talking Avatar Chat Demo</h1>

<div id="configuration">
  <h2 style="background-color: white; width: 300px;">Azure Speech Resource</h2>
  <label style="font-size: medium;" for="region">Region:</label>
  <select id="region" style="font-size: medium;">
    <option value="westus2">West US 2</option>
    <option value="westeurope">West Europe</option>
    <option value="southeastasia">Southeast Asia</option>
  </select>
  <label style="font-size: medium;" for="APIKey">API Key:</label>
  <input id="APIKey" type="password" size="32" style="font-size: medium;" value='${skey}' />
  <div style="background-color: white; width: 300px;">
    <input type="checkbox" id="enablePrivateEndpoint" onchange = "window.updatePrivateEndpoint()">Enable Private Endpoint</input><br />
  </div>
  <div id = "showPrivateEndpointCheckBox" hidden="hidden">
    <label style="font-size: medium;" for="privateEndpoint">Private Endpoint:</label>
    <input id="privateEndpoint" type="text" size="64" style="font-size: medium;" placeholder="https://{your custom name}.cognitiveservices.azure.com/"></input><br />
  </div><br />

  <h2 style="background-color: white; width: 300px;">Azure OpenAI Resource</h2>
  <label style="font-size: medium;" for="azureOpenAIEndpoint">Endpoint:</label>
  <input id="azureOpenAIEndpoint" type="text" size="64" style="font-size: medium;" value='${endpoint}'></input><br />
  <label style="font-size: medium;" for="azureOpenAIApiKey">API Key:</label>
  <input id="azureOpenAIApiKey" type="password" size="32" style="font-size: medium;" value='${akey}' /><br />
  <label style="font-size: medium;" for="azureOpenAIDeploymentName">Deployment Name:</label>
  <input id="azureOpenAIDeploymentName" type="text" size="32" style="font-size: medium;" value='${dep}'/><br />
  <label style="font-size: medium;"  for="prompt">System Prompt:</label><br/>
  <textarea id="prompt" style="width: 640px;">You are an AI assistant that helps people find information.</textarea>
  <div style="background-color: white; width: 300px;">
    <input type="checkbox" id="enableOyd" onchange="window.updataEnableOyd()">Enable On Your Data</input><br />
  </div>
  <br />

  <div id="cogSearchConfig" hidden="hidden">
    <h2 style="background-color: white; width: 400px;">Azure Cognitive Search Resource</h2>
    <label style="font-size: medium;" for="azureCogSearchEndpoint">Endpoint:</label>
    <input id="azureCogSearchEndpoint" type="text" size="64" style="font-size: medium;"></input><br />
    <label style="font-size: medium;" for="azureCogSearchApiKey">API Key:</label>
    <input id="azureCogSearchApiKey" type="password" size="32" style="font-size: medium;" /><br />
    <label style="font-size: medium;" for="azureCogSearchIndexName">Index Name:</label>
    <input id="azureCogSearchIndexName" type="text" size="32" style="font-size: medium;" /><br />
    <br />
  </div>

  <h2 style="background-color: white; width: 300px;">STT / TTS Configuration</h2>
  <label style="font-size: medium;" for="sttLocale">STT Locale(s):</label>
  <input id="sttLocales" type="text" size="64" style="font-size: medium;" value="en-US,de-DE,es-ES,fr-FR,it-IT,ja-JP,ko-KR,zh-CN"></input><br />
  <label style="font-size: medium;" for="ttsVoice">TTS Voice:</label>
  <input id="ttsVoice" type="text" size="32" style="font-size: medium;" value="en-US-AvaMultilingualNeural"></input><br />
  <label style="font-size: medium;" for="customVoiceEndpointId">Custom Voice Deployment ID (Endpoint ID):</label>
  <input id="customVoiceEndpointId" type="text" size="32" style="font-size: medium;" value=""></input><br />
  <label style="font-size: medium;" for="personalVoiceSpeakerProfileID">Personal Voice Speaker Profile ID:</label>
  <input id="personalVoiceSpeakerProfileID" type="text" size="32" style="font-size: medium;" value=""></input><br />
  <div style="background-color: white; width: 300px;">
    <input type="checkbox" id="continuousConversation">Continuous Conversation</input><br />
  </div>
  <br />

  <h2 style="background-color: white; width: 300px;">Avatar Configuration</h2>
  <label style="font-size: medium;" for="talkingAvatarCharacter">Avatar Character:</label>
  <input id="talkingAvatarCharacter" type="text" size="16" style="font-size: medium;" value="lisa"></input><br />
  <label style="font-size: medium;" for="talkingAvatarStyle">Avatar Style:</label>
  <input id="talkingAvatarStyle" type="text" size="16" style="font-size: medium;" value="casual-sitting"></input><br />
  <div style="background-color: white; width: 200px;">
    <input type="checkbox" id="customizedAvatar">Custom Avatar</input><br />
  </div>
  <div style="background-color: white; width: 200px;">
    <input type="checkbox" id="autoReconnectAvatar">Auto Reconnect</input><br />
  </div>
  <div style="background-color: white; width: 200px;">
    <input type="checkbox" id="useLocalVideoForIdle" onchange="window.updateLocalVideoForIdle()">Use Local Video for Idle</input><br />
  </div>
  <br />
</div>

<button id="startSession" onclick="window.startSession()">Open Avatar Session</button>
<button id="microphone" onclick="window.microphone()" disabled>Start Microphone</button>
<button id="stopSpeaking" onclick="stopSpeaking()" disabled>Stop Speaking</button>
<button id="clearChatHistory" onclick="window.clearChatHistory()">Clear Chat History</button>
<button id="stopSession" onclick="window.stopSession()" disabled>Close Avatar Session</button>

<div id="videoContainer" style="position: relative; width: 960px;">
  <div id="overlayArea" style="position: absolute;">
    <div id="chatHistory" style="
        width: 360px;
        height: 500px;
        font-size: medium;
        border: none;
        resize: none;
        background-color: transparent;
        overflow: hidden;" contentEditable="true" hidden></div>
    </div>
    <div id="localVideo" hidden>
      <video src="video/lisa-casual-sitting-idle.mp4" autoplay loop muted></video>
    </div>
    <div id="remoteVideo"></div>
  </div>
  <div margin-top="5px">
    <div id="showTypeMessageCheckbox">
      <input type="checkbox" id="showTypeMessage" onchange="window.updateTypeMessageBox()" disabled>Type Message</input><br />
    </div>
    <div id="userMessageBox"
      style="width: 940px; min-height: 150px; max-height: 200px; border: 1px solid ; overflow-y: scroll; padding: 10px;"
      hidden type="text" contentEditable="true"></div>
  </div>
  <div>
    <img id="uploadImgIcon" src="./image/attachment.jpg" alt="Button" style="cursor: pointer;" hidden />
  </div>
</body>

</html>
`;


// Define a route to serve the HTML content with a query parameter
app.get('/get-html', (req, res) => {
    const name = req.query.name || 'World';
    const skey = req.query.skey;
    const endpoint = req.query.endpoint;
    const akey = req.query.akey;
    const dep = req.query.dep;
    const htmlContent = htmlTemplate(skey, endpoint, akey, dep);
    res.send(htmlContent);
  });
  
  // Define a route to serve the HTML content with a path parameter
  app.get('/get-html/:name', (req, res) => {
    const name = req.params.name;
    const htmlContent = htmlTemplate(name);
    res.send(htmlContent);
  });

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});