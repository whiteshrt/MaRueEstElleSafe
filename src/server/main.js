import express from "express";
import ViteExpress from "vite-express";
import puppeteer from 'puppeteer';

const app = express();

// Création du lien vers le script backend
app.get('/getFreq', async (req, res) => {
    const {rue} = req.query;

    try {
        // Script qui va chercher la fréquentation sur Google Maps
        const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
        const today = new Date();
        const day = today.getDay() + 1;
        console.log(day);
        const hourNumber = today.getHours();
        const hour = "à " + hourNumber + " h.";
        console.log(hourNumber);
        const freqData = [];
        let freqVoie;
        const browser = await puppeteer.launch({headless: 'new'});
        const page = await browser.newPage();

        await page.goto('https://www.google.fr/maps/');


        await page.setViewport({width: 1080, height: 1024});

        const [button] = await page.$x("//button[contains(., 'Tout accepter')]");
        if (!button) throw new Error("Bouton non trouvé");
        await button.click();
        const searchBar = '#searchboxinput';
        await page.waitForSelector(searchBar)
        //RESTAURANTS ------------------------------------------------------
        await page.type(searchBar, 'restaurant ' + rue);
        await delay(4000);
        await page.keyboard.press('Enter');
        await delay(4000);


        await page.keyboard.press('Enter');

        await page.waitForSelector('.hfpxzc')
        await page.click('.hfpxzc');

        // Essaye de chercher le taux de fréquentation actuel

        try {
            const freqRealTime = await page.waitForSelector('.UgBNB', {timeout: 4000})
            const freqRealTimeText = await freqRealTime?.evaluate(el => el.textContent);
            console.log(freqRealTimeText)
            const actualFreq = await page.evaluate(() => {
                const actualFreqText = document.querySelector('[aria-label*="Taux de fréquentation actuel"]');
                return actualFreqText.getAttribute('aria-label');

            });
            const actualFreqSplit = actualFreq.split(' ');
            const actualFreqPercentage = parseInt(actualFreqSplit[5]);
            console.log(actualFreq);
            console.log(actualFreqPercentage);
            freqData.push(actualFreqPercentage);

            // Si cela ne marche pas, essaye de chercher le taux de fréquentation habituel ce jour-ci à cette heure-ci

        } catch (e) {
            try {
                const freqByHour = await page.evaluate(hourDOM => {
                    const todayDOM = new Date();
                    const day = todayDOM.getDay();
                    const freqByHourText = document.querySelectorAll(`[aria-label$="${hourDOM}"]`)[day];
                    return freqByHourText.getAttribute('aria-label');
                }, hour);
                const freqByHourSplit = freqByHour.split(' ');
                const freqByHourPercentage = parseInt(freqByHourSplit[4]);

                console.log(freqByHour);
                console.log(freqByHourPercentage);
                freqData.push(freqByHourPercentage);

                // Sinon, renvoie l'erreur et aucune information trouvée
            } catch (e) {
                console.error(e);
                console.log('Aucune information.')
            }
        } finally {
            await delay(4000);
            await page.click('#QA0Szd > div > div > div.w6VYqd > div.bJzME.tTVLSc > div > div.e07Vkf.kA9KIf > div > div > div.m6QErb.DxyBCb.kA9KIf.dS8AEf.ecceSd > div.m6QErb.DxyBCb.kA9KIf.dS8AEf.ecceSd > div:nth-child(5) > div > a');
            try {
                await delay(4000);
                const freqRealTime2 = await page.waitForSelector('.UgBNB', {timeout: 4000})
                const freqRealTimeText2 = await freqRealTime2?.evaluate(el => el.textContent);
                console.log(freqRealTimeText2);
                const actualFreq2 = await page.evaluate(() => {
                    const actualFreqText2 = document.querySelector('[aria-label*="Taux de fréquentation actuel"]');
                    return actualFreqText2.getAttribute('aria-label');

                });
                const actualFreqSplit2 = actualFreq2.split(' ');
                const actualFreqPercentage2 = parseInt(actualFreqSplit2[5]);
                console.log(actualFreq2);
                console.log(actualFreqPercentage2);
                freqData.push(actualFreqPercentage2);
            } catch (e) {
                try {
                    const freqByHour2 = await page.evaluate(hourDOM2 => {
                        const todayDOM = new Date();
                        const day = todayDOM.getDay();
                        const freqByHourText2 = document.querySelectorAll(`[aria-label$="${hourDOM2}"]`)[day];
                        return freqByHourText2.getAttribute('aria-label');
                    }, hour);
                    const freqByHourSplit2 = freqByHour2.split(' ');
                    const freqByHourPercentage2 = parseInt(freqByHourSplit2[4]);

                    console.log(freqByHour2);
                    console.log(freqByHourPercentage2);
                    freqData.push(freqByHourPercentage2);
                } catch (e) {
                    console.error(e);
                    console.log('Aucune information.')
                }
            } finally {
                await delay(4000);

                await page.click('#QA0Szd > div > div > div.w6VYqd > div:nth-child(2) > div > div.e07Vkf.kA9KIf > div > div > div.m6QErb.DxyBCb.kA9KIf.dS8AEf.ecceSd > div.m6QErb.DxyBCb.kA9KIf.dS8AEf.ecceSd > div:nth-child(7) > div > a');
                try {
                    await delay(4000);
                    const freqRealTime3 = await page.waitForSelector('.UgBNB', {timeout: 4000})
                    const freqRealTimeText3 = await freqRealTime3?.evaluate(el => el.textContent);
                    console.log(freqRealTimeText3)
                    const actualFreq3 = await page.evaluate(() => {
                        const actualFreqText3 = document.querySelector('[aria-label*="Taux de fréquentation actuel"]');
                        return actualFreqText3.getAttribute('aria-label');

                    });
                    const actualFreqSplit3 = actualFreq3.split(' ');
                    const actualFreqPercentage3 = parseInt(actualFreqSplit3[5]);
                    console.log(actualFreq3);
                    console.log(actualFreqPercentage3);
                    freqData.push(actualFreqPercentage3);
                } catch (e) {
                    try {
                        const freqByHour3 = await page.evaluate(hourDOM3 => {
                            const todayDOM = new Date();
                            const day = todayDOM.getDay();
                            const freqByHourText3 = document.querySelectorAll(`[aria-label$="${hourDOM3}"]`)[day];
                            return freqByHourText3.getAttribute('aria-label');
                        }, hour);
                        const freqByHourSplit3 = freqByHour3.split(' ');
                        const freqByHourPercentage3 = parseInt(freqByHourSplit3[4]);

                        console.log(freqByHour3);
                        console.log(freqByHourPercentage3);
                        freqData.push(freqByHourPercentage3);
                    } catch (e) {
                        console.error(e);
                        console.log('Aucune information.')
                    }
                    // SUPERMARCHES ----------------------------------------------------
                } finally {
                    await delay(4000);

                    const searchBar2 = await page.$('#searchboxinput');
                    await searchBar2.click({clickCount: 3})
                    await searchBar2.type('supermarché ' + rue);
                    await delay(4000);
                    await page.keyboard.press('Enter');
                    await delay(4000);
                    await page.keyboard.press('Enter');
                    await page.waitForSelector('.hfpxzc')
                    await page.click('.hfpxzc');
                    try {
                        const freqRealTime4 = await page.waitForSelector('.UgBNB', {timeout: 4000})
                        const freqRealTimeText4 = await freqRealTime4?.evaluate(el => el.textContent);
                        console.log(freqRealTimeText4)
                        const actualFreq4 = await page.evaluate(() => {
                            const actualFreqText4 = document.querySelector('[aria-label*="Taux de fréquentation actuel"]');
                            return actualFreqText4.getAttribute('aria-label');
                        });
                        const actualFreqSplit4 = actualFreq4.split(' ');
                        const actualFreqPercentage4 = parseInt(actualFreqSplit4[5]);
                        console.log(actualFreq4);
                        console.log(actualFreqPercentage4);
                        freqData.push(actualFreqPercentage4);
                    } catch (e) {
                        try {
                            const freqByHour4 = await page.evaluate(hourDOM4 => {
                                const todayDOM = new Date();
                                const day = todayDOM.getDay();
                                const freqByHourText4 = document.querySelectorAll(`[aria-label$="${hourDOM4}"]`)[day];
                                return freqByHourText4.getAttribute('aria-label');
                            }, hour);
                            const freqByHourSplit4 = freqByHour4.split(' ');
                            const freqByHourPercentage4 = parseInt(freqByHourSplit4[4]);

                            console.log(freqByHour4);
                            console.log(freqByHourPercentage4);
                        } catch (e) {
                            console.error(e);
                            console.log('Aucune information.')
                        }
                    } finally {
                        await delay(4000);

                        await page.click('#QA0Szd > div > div > div.w6VYqd > div.bJzME.tTVLSc > div > div.e07Vkf.kA9KIf > div > div > div.m6QErb.DxyBCb.kA9KIf.dS8AEf.ecceSd > div.m6QErb.DxyBCb.kA9KIf.dS8AEf.ecceSd > div:nth-child(5) > div > a');
                        await delay(4000);

                        try {
                            const freqRealTime5 = await page.waitForSelector('.UgBNB', {timeout: 4000})
                            const freqRealTimeText5 = await freqRealTime5?.evaluate(el => el.textContent);
                            console.log(freqRealTimeText5)
                            const actualFreq5 = await page.evaluate(() => {
                                const actualFreqText5 = document.querySelector('[aria-label*="Taux de fréquentation actuel"]');
                                return actualFreqText5.getAttribute('aria-label');

                            });
                            const actualFreqSplit5 = actualFreq5.split(' ');
                            const actualFreqPercentage5 = parseInt(actualFreqSplit5[5]);
                            console.log(actualFreq5);
                            console.log(actualFreqPercentage5);
                            freqData.push(actualFreqPercentage5);
                        } catch (e) {
                            try {
                                const freqByHour5 = await page.evaluate(hourDOM5 => {
                                    const todayDOM = new Date();
                                    const day = todayDOM.getDay();
                                    const freqByHourText5 = document.querySelectorAll(`[aria-label$="${hourDOM5}"]`)[day];
                                    return freqByHourText5.getAttribute('aria-label');
                                }, hour);
                                const freqByHourSplit5 = freqByHour5.split(' ');
                                const freqByHourPercentage5 = parseInt(freqByHourSplit5[4]);

                                console.log(freqByHour5);
                                console.log(freqByHourPercentage5);
                                freqData.push(freqByHourPercentage5);
                            } catch (e) {
                                console.error(e);
                                console.log('Aucune information.')
                            }
                        } finally {
                            await delay(4000);

                            await page.click('#QA0Szd > div > div > div.w6VYqd > div:nth-child(2) > div > div.e07Vkf.kA9KIf > div > div > div.m6QErb.DxyBCb.kA9KIf.dS8AEf.ecceSd > div.m6QErb.DxyBCb.kA9KIf.dS8AEf.ecceSd > div:nth-child(7) > div > a');
                            await delay(4000);
                            try {
                                const freqRealTime6 = await page.waitForSelector('.UgBNB', {timeout: 4000})
                                const freqRealTimeText6 = await freqRealTime6?.evaluate(el => el.textContent);
                                console.log(freqRealTimeText6)
                                const actualFreq6 = await page.evaluate(() => {
                                    const actualFreqText6 = document.querySelector('[aria-label*="Taux de fréquentation actuel"]');
                                    return actualFreqText6.getAttribute('aria-label');

                                });
                                const actualFreqSplit6 = actualFreq6.split(' ');
                                const actualFreqPercentage6 = parseInt(actualFreqSplit6[5]);
                                console.log(actualFreq6);
                                console.log(actualFreqPercentage6);
                                freqData.push(actualFreqPercentage6);
                            } catch (e) {
                                try {
                                    const freqByHour6 = await page.evaluate(hourDOM6 => {
                                        const todayDOM = new Date();
                                        const day = todayDOM.getDay();
                                        const freqByHourText6 = document.querySelectorAll(`[aria-label$="${hourDOM6}"]`)[day];
                                        return freqByHourText6.getAttribute('aria-label');
                                    }, hour);


                                    const freqByHourSplit6 = freqByHour6.split(' ');
                                    const freqByHourPercentage6 = parseInt(freqByHourSplit6[4]);


                                    console.log(freqByHour6);
                                    console.log(freqByHourPercentage6);
                                    freqData.push(freqByHourPercentage6);
                                } catch (e) {
                                    console.error(e);
                                    console.log('Aucune information.')
                                }
                                // Après tout cela, stocke toutes les infos récupérées dans un tableau et enlève les 0 (lieux fermés) ensuite compile et fait la moyenne et renvoie une valeur de fréquentation en fonction
                            } finally {
                                console.log(freqData);
                                const sum = freqData.reduce((a, c) => a + c, 0);
                                const avg = Math.round(sum / freqData.length);
                                console.log(avg);
                                if (avg < 50) {
                                    freqVoie = "assez peu fréquentée"
                                } else if (avg < 30) {
                                    freqVoie = "peu fréquentée"
                                } else if (avg >= 50) {
                                    freqVoie = "assez fréquentée"
                                } else if (avg >= 80) {
                                    freqVoie = "très fréquentée"
                                }
                                console.log(freqVoie);
                            }


                        }
                    }
                }
            }
        }
        res.json({freqVoie});
    } catch (error) {
        console.error(error);
        res.status(500).send('Une erreur est survenue');
    }
});

ViteExpress.listen(app, 3000, () =>
    console.log("Server is listening on port 3000...")
);
