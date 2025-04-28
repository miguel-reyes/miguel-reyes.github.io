javascript:(async function() {
              async function wait(ms) {
                            return new Promise(resolve => setTimeout(resolve, ms));
              }

              function loadingLayerIsShown() {
                            return document.querySelector("#loadingLayer").style.display !== "none";
              }

              async function waitForLoadingLayerToDisappear() {
                            while (loadingLayerIsShown()) {
                                          await wait(100);
                            }
              }

              async function waitForElement(selector) {
                            while (document.querySelector(selector) === null) {
                                          await wait(100);
                            }
              }

              async function waitForElements(selectorArray) {
                             const promises = selectorArray.map(selector => waitForElement(selector));
                             await Promise.all(promises);
              }

              async function standardWait(selectorArray) {
                            await wait(1000);
                            await waitForLoadingLayerToDisappear();
                            await waitForElements(selectorArray);
                            await wait(1000);
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

              console.log("Creating Input and Click");
              const CSVArray = await createInputAndClick();
              console.log("Done creating Input and Click");
              console.log("Prompting");
              let qmdurchfuehrer = prompt("Bitte User ID vom QM-Durchführer Eingeben", "XXXX");
              console.log("Done Prompting done");

              async function addGeneralInformation() {
                            const generalInformationSelectors = ["#releaseIKS", "#responsibleITK", "#testLevelBAT"];
                            console.log("await standardWait(generalInformationSelectors)");
                            await standardWait(generalInformationSelectors);
                            console.log("Done await standardWait(generalInformationSelectors)");
                            console.log("setting general information");
                            document.querySelector(generalInformationSelectors[0]).value = "N";
                            document.querySelector(generalInformationSelectors[1]).value = "L357";
                          document.querySelector(generalInformationSelectors[2]).click();
                            console.log("Done setting general information done");
              }

              async function addQMassnahmen() {
                            const addQMassnahmenSelectors = ["#selectQExecution_add_value", "#selectQExecution_add"];
                            console.log("await standardWait(addQMassnahmenSelectors)");
                            await standardWait(addQMassnahmenSelectors);
                            console.log("Done await standardWait(addQMassnahmenSelectors) done");
                            console.log("setting Q-Massnahmen");
                            document.querySelector(addQMassnahmenSelectors[0]).value = "2";
                          document.querySelector(addQMassnahmenSelectors[1]).click();
                            console.log("Done setting Q-Massnahmen done");

                            const qMassnahmenArr = ["Q007", "Q050"];
                            for (let numberOfQMassnahmenArr = 0; numberOfQMassnahmenArr < qMassnahmenArr.length; numberOfQMassnahmenArr = numberOfQMassnahmenArr + 1) {
                                          console.log(`Outer loop, number: ${numberOfQMassnahmenArr}, value: ${qMassnahmenArr[numberOfQMassnahmenArr]}`);
                                          const addDocumentSelectors = [`#selectQExecution_showDocuments_${numberOfQMassnahmenArr}`];
                                          console.log(`Outer loop, number: ${numberOfQMassnahmenArr}, value: ${qMassnahmenArr[numberOfQMassnahmenArr]}, await standardWait(addDocumentSelectors)`);
                                          await standardWait(addDocumentSelectors);
                                          console.log(`Done Outer loop, number: ${numberOfQMassnahmenArr}, value: ${qMassnahmenArr[numberOfQMassnahmenArr]}, await standardWait(addDocumentSelectors) done`);
                                          console.log(`Outer loop, number: ${numberOfQMassnahmenArr}, value: ${qMassnahmenArr[numberOfQMassnahmenArr]}, addDocumentSelectors click`);
                                          document.querySelector(addDocumentSelectors[0]).click();
                                          console.log(`Done Outer loop, number: ${numberOfQMassnahmenArr}, value: ${qMassnahmenArr[numberOfQMassnahmenArr]}, addDocumentSelectors click done`);

                                          const addFileSelectors = ["#filesAttachments_add"];
                                          console.log(`Outer loop, number: ${numberOfQMassnahmenArr}, value: ${qMassnahmenArr[numberOfQMassnahmenArr]}, await standardWait(addFileSelectors)`);
                                          await standardWait(addFileSelectors);
                                          console.log(`Done Outer loop, number: ${numberOfQMassnahmenArr}, value: ${qMassnahmenArr[numberOfQMassnahmenArr]}, await standardWait(addFileSelectors) done`);
                                          for (let numberOfCSVArray = 0; numberOfCSVArray < CSVArray.length; numberOfCSVArray = numberOfCSVArray + 1) {
                                                         console.log(`Outer loop, number: ${numberOfQMassnahmenArr}, value: ${qMassnahmenArr[numberOfQMassnahmenArr]}, inner loop number: ${numberOfCSVArray}, value: ${CSVArray[numberOfCSVArray]}`);
                                                         let skippedElements = 0;
                                                         if (CSVArray[numberOfCSVArray]["Q-Maßnahme"] !== qMassnahmenArr[numberOfQMassnahmenArr]) {
                                                                       skippedElements = skippedElements + 1;
                                                                       console.log(`Skipping outer loop, number: ${numberOfQMassnahmenArr}, value: ${qMassnahmenArr[numberOfQMassnahmenArr]}, inner loop number: ${numberOfCSVArray}, value: ${CSVArray[numberOfCSVArray]}`);
                                                                       console.log(`skippedElements: ${skippedElements}`);
                                                                       console.log(`CSVArray[numberOfCSVArray]["Q-Maßnahme"]: ${CSVArray[numberOfCSVArray]["Q-Maßnahme"]}`);
                                                                       console.log(`qMassnahmenArr[numberOfQMassnahmenArr]: ${qMassnahmenArr[numberOfQMassnahmenArr]}`);
                                                                       console.log(`CSVArray:`);
                                                                       console.log(CSVArray);
                                                                       continue;
                                                         }
                                                         console.log(`Outer loop, number: ${numberOfQMassnahmenArr}, value: ${qMassnahmenArr[numberOfQMassnahmenArr]}, inner loop number: ${numberOfCSVArray}, value: ${CSVArray[numberOfCSVArray]}, add file selectors`);
                                                        document.querySelector(addFileSelectors[0]).click();
                                                         console.log(`Done Outer loop, number: ${numberOfQMassnahmenArr}, value: ${qMassnahmenArr[numberOfQMassnahmenArr]}, inner loop number: ${numberOfCSVArray}, value: ${CSVArray[numberOfCSVArray]}, add file selectors done`);

                                                         const fieldSelectors = [`#filesAttachments_docOrLink_${numberOfCSVArray - skippedElements}`, `#filesAttachments_relevantLink_${numberOfCSVArray - skippedElements}`, `#filesAttachments_infoComment_${numberOfCSVArray - skippedElements}`, `#filesAttachments_fileDescription_${numberOfCSVArray - skippedElements}`, `#filesAttachments_fileDeliveredBy_${numberOfCSVArray - skippedElements}`];
                                                         console.log(`Outer loop, number: ${numberOfQMassnahmenArr}, value: ${qMassnahmenArr[numberOfQMassnahmenArr]}, inner loop number: ${numberOfCSVArray}, value: ${CSVArray[numberOfCSVArray]}, await standardWait(fieldSelectors)`);
                                                         await standardWait(fieldSelectors);
                                                         console.log(`Done Outer loop, number: ${numberOfQMassnahmenArr}, value: ${qMassnahmenArr[numberOfQMassnahmenArr]}, inner loop number: ${numberOfCSVArray}, value: ${CSVArray[numberOfCSVArray]}, await standardWait(fieldSelectors) done`);
                                                         console.log(`Outer loop, number: ${numberOfQMassnahmenArr}, value: ${qMassnahmenArr[numberOfQMassnahmenArr]}, inner loop number: ${numberOfCSVArray}, value: ${CSVArray[numberOfCSVArray]}, set document fields`);
                                                        document.querySelector(fieldSelectors[0]).value = "link";
                                                        document.querySelector(fieldSelectors[0]).dispatchEvent(new Event("change"));
                                                        document.querySelector(fieldSelectors[1]).value = CSVArray[numberOfCSVArray]["Dokument-URL"];
                                                        document.querySelector(fieldSelectors[2]).value = CSVArray[numberOfCSVArray]["Kommentar"];
                                                        document.querySelector(fieldSelectors[3]).value = CSVArray[numberOfCSVArray]["Dokumenttyp"];
                                                        document.querySelector(fieldSelectors[4]).value = "other";
                                                        document.querySelector(fieldSelectors[4]).dispatchEvent(new Event("change"));
                                                         console.log(`Done Outer loop, number: ${numberOfQMassnahmenArr}, value: ${qMassnahmenArr[numberOfQMassnahmenArr]}, inner loop number: ${numberOfCSVArray}, value: ${CSVArray[numberOfCSVArray]}, set document fields done`);

                                                         const addDeliveredByOtherSelectors = [`#filesAttachments_fileDeliveredByOther_${numberOfCSVArray - skippedElements}`];
                                                         console.log(`Outer loop, number: ${numberOfQMassnahmenArr}, value: ${qMassnahmenArr[numberOfQMassnahmenArr]}, inner loop number: ${numberOfCSVArray}, value: ${CSVArray[numberOfCSVArray]}, await standardWait(addDeliveredByOtherSelectors)`);
                                                         await standardWait(addDeliveredByOtherSelectors);
                                                         console.log(`Done Outer loop, number: ${numberOfQMassnahmenArr}, value: ${qMassnahmenArr[numberOfQMassnahmenArr]}, inner loop number: ${numberOfCSVArray}, value: ${CSVArray[numberOfCSVArray]}, await standardWait(addDeliveredByOtherSelectors) done`);
                                                         console.log(`Outer loop, number: ${numberOfQMassnahmenArr}, value: ${qMassnahmenArr[numberOfQMassnahmenArr]}, inner loop number: ${numberOfCSVArray}, value: ${CSVArray[numberOfCSVArray]}, adding delivered by other`);
                                                    document.querySelector(addDeliveredByOtherSelectors[0]).value = CSVArray[numberOfCSVArray]["Eingestellt von"];
                                                         console.log(`Done Outer loop, number: ${numberOfQMassnahmenArr}, value: ${qMassnahmenArr[numberOfQMassnahmenArr]}, inner loop number: ${numberOfCSVArray}, value: ${CSVArray[numberOfCSVArray]}, adding delivered by other done`);
                                                         console.log(`Done Outer loop, number: ${numberOfQMassnahmenArr}, value: ${qMassnahmenArr[numberOfQMassnahmenArr]}, inner loop number: ${numberOfCSVArray}, value: ${CSVArray[numberOfCSVArray]}`);
                                          }

                                          const closeFilesAttachmentsSelectors = ["#dialogForm > div.ui-dialog.ui-corner-all.ui-widget.ui-widget-content.ui-front.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button"];
                                          console.log(`Outer loop, number: ${numberOfQMassnahmenArr}, value: ${qMassnahmenArr[numberOfQMassnahmenArr]}, await standardWait(closeFilesAttachmentsSelectors)`);
                                          await standardWait(closeFilesAttachmentsSelectors);
                                          console.log(`Done Outer loop, number: ${numberOfQMassnahmenArr}, value: ${qMassnahmenArr[numberOfQMassnahmenArr]}, await standardWait(closeFilesAttachmentsSelectors) done`);
                                          console.log(`Outer loop, number: ${numberOfQMassnahmenArr}, value: ${qMassnahmenArr[numberOfQMassnahmenArr]}, close Files Attachments`);
                                 document.querySelector(closeFilesAttachmentsSelectors[0]).click();
                                          console.log(`Done Outer loop, number: ${numberOfQMassnahmenArr}, value: ${qMassnahmenArr[numberOfQMassnahmenArr]}, close Files Attachments`);

                                          const setQMassnahmenInfosSelectors = [`#selectQExecution_qmId_${numberOfQMassnahmenArr}`, `#selectQExecution_qmExecution_${numberOfQMassnahmenArr}`];
                                          console.log(`Outer loop, number: ${numberOfQMassnahmenArr}, value: ${qMassnahmenArr[numberOfQMassnahmenArr]}, await standardWait(setQMassnahmenInfosSelectors)`);
                                          await standardWait(setQMassnahmenInfosSelectors);
                                          console.log(`Done Outer loop, number: ${numberOfQMassnahmenArr}, value: ${qMassnahmenArr[numberOfQMassnahmenArr]}, await standardWait(setQMassnahmenInfosSelectors)`);
                                          console.log(`Outer loop, number: ${numberOfQMassnahmenArr}, value: ${qMassnahmenArr[numberOfQMassnahmenArr]}, set qMassnahmen infos`);
                                   document.querySelector(setQMassnahmenInfosSelectors[0]).value = qMassnahmenArr[numberOfQMassnahmenArr];
                                   document.querySelector(setQMassnahmenInfosSelectors[1]).value = qmdurchfuehrer;
                                          console.log(`Done Outer loop, number: ${numberOfQMassnahmenArr}, value: ${qMassnahmenArr[numberOfQMassnahmenArr]}, set qMassnahmen infos`);
                                          console.log(`Done Outer loop, number: ${numberOfQMassnahmenArr}, value: ${qMassnahmenArr[numberOfQMassnahmenArr]}`);
                            }
              }

              if (CSVArray) {
                            console.log("Adding general information");
                            await addGeneralInformation();
                            console.log("Done Adding general information");
                            console.log("Adding Q-Massnahmen");
                            await addQMassnahmen(CSVArray);
                            console.log("Done Adding Q-Massnahmen");
              } else {
                            console.error("CSVArray is null. Please ensure a valid CSV file is uploaded.");
              }

              await wait(1000);

              alert(`Das Skript ist beendet. Bitte geben sie den Change unter "Release ID (HPSM) / Sammler ID (ServiceNow)" oder "Normal Change ID" ein und weisen sie die Q-Maßnahme einem Benutzer zu.`);
})();
