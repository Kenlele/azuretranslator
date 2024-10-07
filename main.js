$(document).ready(function () {
    // 注册按钮的 click 事件
    $("#thisButton").click(function () {
        // 检查文件输入是否有文件
        if ($("#inputImageFile")[0].files.length > 0) {
            processfileOCR($("#inputImageFile")[0].files[0]);
        } else {
            processOCR();
        }
    });
});


function processOCR() {
   
    let endpoint = "https://eastus.api.cognitive.microsoft.com/"; //區域使用
    if (!subscriptionKey) { throw new Error('Set your environment variables for your subscription key and endpoint.'); }

    var uriBase = endpoint + "vision/v2.1/ocr";   //區域使用+使用所謂的服務 

    // Display the image.
    var sourceImageUrl = document.getElementById("inputImage").value;
    document.querySelector("#sourceImage").src = sourceImageUrl;



    var params = {       //參數
        // Request parameters
        "language": "zh-Hant",
        "detectOrientation": "true",
    };



    $.ajax({
        //url: uriBase,
        //url: "https://westus.api.cognitive.microsoft.com/vision/v2.1/ocr?" + $.param(params),
        url: uriBase + "?" + $.param(params),
    
        // Request headers.
        beforeSend: function (jqXHR) {
            jqXHR.setRequestHeader("Content-Type", "application/json");
            jqXHR.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
       
        },
    
        type: "POST",
    
        // Request body.
        data: '{"url": ' + '"' + sourceImageUrl + '"}',
    })
    .done(function (data) {
        $("#responseTextArea").val(JSON.stringify(data, null, 2));
    
        let regions = data.regions;
        let recognizedText = "";
        let charCount = 0;

        regions.forEach(region => {
        region.lines.forEach(line => {
            line.words.forEach(word => {
                recognizedText += word.text + " ";
                charCount += word.text.length + 1; // 包括空格

                if (charCount >=70) {
                    recognizedText += "<br>";
                    charCount = 0;
                }

                    
            });
        });
    });
 
        $("#sRecognitionCardNumber").html(recognizedText);
        
        processTranslate(recognizedText); 
})
    .fail(function (jqXHR, textStatus, errorThrown) {
            // Put the JSON description into the text area.
            $("#responseTextArea").val(JSON.stringify(jqXHR, null, 2));
        
            // Display error message.
            var errorString = (errorThrown === "") ? "Error. " :
                errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" :
                (jQuery.parseJSON(jqXHR.responseText).message) ?
                    jQuery.parseJSON(jqXHR.responseText).message :
                    jQuery.parseJSON(jqXHR.responseText).error.message;
            alert(errorString);
        });



function processTranslate(recognizedText) {

    let uriBase = "https://api.cognitive.microsofttranslator.com/translate";
    let targetLang = $("#languageSelect").val();  //選擇語言選項
    let params = {
        "api-version": "3.0",
        "to": targetLang  //想要翻譯的語言
        //"from":"lzh"
    };
    
    
    //送出分析
    $.ajax({
        url: uriBase + "?" + $.param(params),
        // Request header
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey2);
            // 如果不是設定全域，就要加上這一行指定你所選擇的區域
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Region", "swedencentral");
        },
        type: "POST",
        // Request body
        //data: '[{"Text": ' + '"' + sourceTranslateText + '"}]',
        data: JSON.stringify([{ Text: recognizedText }]),



    })
    .done(function(data) {
        //顯示JSON內容
        $("#translateResult").empty()
        $("#responseTextArea").val(JSON.stringify(data, null, 2));
        //取得翻譯結果
        for(var x=0 ;x< data[0].translations.length ; x++) {
            $("#translateResult").append(data[0].translations[x].text+"<br>");  //印出結果


        }

    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        //丟出錯誤訊息
        var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
        alert(errorString);
    });
};
};


function processfileOCR(imageObject) {
   
    let endpoint = "https://eastus.api.cognitive.microsoft.com/"; //區域使用
    if (!subscriptionKey) { throw new Error('Set your environment variables for your subscription key and endpoint.'); }

    var uriBase = endpoint + "vision/v2.1/ocr";   //區域使用+使用所謂的服務 

    // Display the image.
    var sourceImageUrl = URL.createObjectURL(imageObject);
    document.querySelector("#sourceImage").src = sourceImageUrl;



    var params = {       //參數
        // Request parameters
        "language": "zh-Hant",
        "detectOrientation": "true",
    };



    $.ajax({
        //url: uriBase,
        //url: "https://westus.api.cognitive.microsoft.com/vision/v2.1/ocr?" + $.param(params),
        url: uriBase + "?" + $.param(params),
    
        // Request headers.
        beforeSend: function (jqXHR) {
            jqXHR.setRequestHeader("Content-Type", "application/octet-stream");
            jqXHR.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
       
        },
    
        type: "POST",
        processData:false,
        cotentType:false,
        // Request body.
        data: imageObject
    })
    .done(function (data) {
        $("#responseTextArea").val(JSON.stringify(data, null, 2));
    
        let regions = data.regions;
        let recognizedText = "";
        let charCount = 0;

        regions.forEach(region => {
        region.lines.forEach(line => {
            line.words.forEach(word => {
                recognizedText += word.text + " ";
                charCount += word.text.length + 1; // 包括空格

                if (charCount >=70) {
                    recognizedText += "<br>";
                    charCount = 0;
                }

                    
            });
        });
    });
 
        $("#sRecognitionCardNumber").html(recognizedText);
        
        processTranslate(recognizedText); 
})
    .fail(function (jqXHR, textStatus, errorThrown) {
            // Put the JSON description into the text area.
            $("#responseTextArea").val(JSON.stringify(jqXHR, null, 2));
        
            // Display error message.
            var errorString = (errorThrown === "") ? "Error. " :
                errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" :
                (jQuery.parseJSON(jqXHR.responseText).message) ?
                    jQuery.parseJSON(jqXHR.responseText).message :
                    jQuery.parseJSON(jqXHR.responseText).error.message;
            alert(errorString);
        });



function processTranslate(recognizedText) {

    let uriBase = "https://api.cognitive.microsofttranslator.com/translate";
    let targetLang = $("#languageSelect").val();  //選擇語言選項
    let params = {
        "api-version": "3.0",
        "to": targetLang  //想要翻譯的語言
        //"from":"lzh"
    };
    
    
    //送出分析
    $.ajax({
        url: uriBase + "?" + $.param(params),
        // Request header
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey2);
            // 如果不是設定全域，就要加上這一行指定你所選擇的區域
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Region", "swedencentral");
        },
        type: "POST",
        // Request body
        //data: '[{"Text": ' + '"' + sourceTranslateText + '"}]',
        data: JSON.stringify([{ Text: recognizedText }]),



    })
    .done(function(data) {
        //顯示JSON內容
        $("#translateResult").empty()
        $("#responseTextArea").val(JSON.stringify(data, null, 2));
        //取得翻譯結果
        for(var x=0 ;x< data[0].translations.length ; x++) {
            $("#translateResult").append(data[0].translations[x].text+"<br>");  //印出結果


        }

    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        //丟出錯誤訊息
        var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
        alert(errorString);
    });
};
};


