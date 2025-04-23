 javascript:(async function() {
    async function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function loadingLayerIsShown() {
        return document.querySelector("#loadingLayer").style.display !== "none";
    }

    async function waitForLoadingLayerToDisappear() {
        while (!loadingLayerIsShown()) {
            await wait(100);
        }
    }

    async function waitForElement(selector) {
        while (document.querySelector(selector) === null) {
            await wait(100);
        }
    }

    async function addPruefgegenstand(arr){
        let countPruefgegenstand = 0;
        for(let i = 0; i < arr.length; i++) {
            try {
                if(arr[i]["Q-Maßnahme"] === document.querySelector("#jr-step-actionbar > li:nth-child(2) > h1 > span.jr-headline-steplabel").textContent.substring(0, 4)){
                    document.querySelector("#addExamination").click();
                    await wait(1000);
                    document.querySelector("#addExamDocLink").value = "link";
                    document.querySelector("#addExamDocType").value = arr[i]["Dokumenttyp"];
                    document.querySelector("#addExamDeliverer").value = "other";
                    document.querySelector("#addExamDeliverer").dispatchEvent(new Event("change"));
                    document.querySelector("#addExamOtherDeliv").value = arr[i]["Eingestellt von"];
                    document.querySelector("#addExamComment").value = arr[i]["Kommentar"];
                    await wait(1000);
                    await document.querySelector("body > div:nth-child(7) > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)").click();
                    await wait(1000);
                    await waitForLoadingLayerToDisappear();
                    await waitForElement(`#filesAttachments_relevantLink_${countPruefgegenstand}`);
                    await wait(2000);
                    document.querySelector(`#filesAttachments_relevantLink_${countPruefgegenstand}`).value = arr[i]["Dokument-URL"];
                    countPruefgegenstand = countPruefgegenstand + 1;
                }
            } catch (error) {
                console.error("Error processing item:", arr[i], error);
            }
        }
    }

    async function readCSV(file){
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = function(e){
                let content = e.target.result;
                let lines = content.split("\n");
                if (lines.length < 5) {
                    reject("CSV file does not contain enough lines.");
                    return;
                }
                let headers = lines[3].split(";");
                let jsonArray = [];
                for(let i = 4; i < lines.length; i++){
                    let row = lines[i].split(";");
                    if(row.length === headers.length){
                        let jsonObject = {};
                        for(let j = 0; j < headers.length; j++){
                            jsonObject[headers[j].trim()] = row[j].trim();
                        }
                        jsonArray.push(jsonObject);
                    } else {
                        console.warn(`Row length does not match headers: ${row.length} (expected ${headers.length})`, row);
                    }
                }
                resolve(jsonArray);
            };
            reader.onerror = function() {
                reject("Error reading the file.");
            };
            reader.readAsText(file);
        });
    }

    async function createInputAndClick() {
        return new Promise((resolve) => {
            let input = document.createElement("input");
            input.type = "file";
            input.accept = ".csv";
            input.onchange = async function(event){
                let file = event.target.files[0];
                if (file){
                    resolve(await readCSV(file));
                }
            };
            input.click();
        });
    }

    document.querySelector("#testLevelBAT").click();

    const CSVArray = await createInputAndClick();

    if (CSVArray) {
        await addPruefgegenstand(CSVArray);
    } else {
        console.error("CSVArray is null. Please ensure a valid CSV file is uploaded.");
    }

    await wait(1000);

    alert(`Das Skript ist beendet. Bitte geben sie den Change unter "Release ID (HPSM) / Sammler ID (ServiceNow)" oder "Normal Change ID" ein und weisen sie die Q-Maßnahme einem Benutzer zu.`);
})(); 
