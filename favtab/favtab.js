/**
 * @author Felix Müller aka syl3r86
 * @version 0.4.1
 */


Hooks.on(`renderActorSheet5eCharacter`, (app, html, data) => {

    // creating the favourite tab and loading favourited items
    let favTabBtn = $('<a class="item" data-tab="favourite"><i class="fas fa-star"></i></a>');
    let favTabDiv = $('<div class="tab inventory-list favourite" data-group="primary" data-tab="favourite"></div>');

    let olStyle = `style="padding-left:5px;"`;
    let favItemOl = $(`<ol class="fav-item" ${olStyle}></ol>`);
    let favFeatOl = $(`<ol class="fav-feat" ${olStyle}></ol>`);
    let favSpellOl = $(`<ol class="fav-spell" ${olStyle}></ol>`);

    let favItems = [];
    let favFeats = [];
    let favSpells = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [] }

    let items = data.actor.items;

    // processing all items and put them in their respective lists if they're favourited
    for (let item of items) {
        // making sure the flag to set favourites exists
        if (item.flags.favtab === undefined || item.flags.favtab.isFavourite === undefined) {
            item.flags.favtab = { isFavourite: false };
            // DO NOT SAVE AT THIS POINT! saving for each and every item creates unneeded data and hogs the system
            //app.actor.updateOwnedItem(item, true);
        }
        let isFav = item.flags.favtab.isFavourite;

        // add button to toggle favourite of the item in their native tab
        if (app.options.editable) {
            let favBtn = $(`<a class="item-control item-fav" data-fav="${isFav}" title="${isFav ? "remove from favourites" : "add to favourites"}"><i class="fas ${isFav ? "fa-star" : "fa-sign-in-alt"}"></i></a>`);
            favBtn.click(ev => {
                item.flags.favtab.isFavourite = !item.flags.favtab.isFavourite;
                app.actor.updateOwnedItem(item, true);
            });
            html.find(`.item[data-item-id="${item.id}"]`).find('.item-controls').prepend(favBtn);
        }
        
        if (isFav) {
            switch (item.type) {
                case 'feat':
                    favFeats.push(item);
                    break;
                case 'spell':
                    favSpells[item.data.level.value].push(item);
                    break;
                default:
                    favItems.push(item);
                    break;
            }
        }
    }

    // creating the item list
    if (favItems.length >= 1) {
        let itemHeader = $(`<li class="item inventory-header"><h3>Items</h3></li>`);
        favItemOl.append(itemHeader);
        for (let item of favItems) {
            let itemLi = createItemElement(item, app, html, data);
            favItemOl.append(itemLi);
        }
    }

    // creating the feats list
    if (favFeats.length >= 1) {
        let itemHeader = $(`<li class="item inventory-header"><h3>Feats</h3></li>`);
        favFeatOl.append(itemHeader);
        for (let item of favFeats) {
            let itemLi = createItemElement(item, app, html, data);
            favFeatOl.append(itemLi);
        }
    }

    // creating the spell list
    for (let spellLvl in favSpells) {
        if (favSpells[spellLvl].length >= 1) {
            let itemHeader = '';
            if (spellLvl === '0') {
                itemHeader = $(`<li class="item inventory-header"><h3>Cantrips</h3></li>`);
            } else {
                let spellslot = data.actor.data.spells['spell' + spellLvl].value;
                let spellMax = data.actor.data.spells['spell' + spellLvl].max;
                let inputStyle = 'style="height:1em; width:2em; margin:0 1px; padding:0;"';
                itemHeader = `<li class="item inventory-header">`;
                itemHeader += `<h3>Spell Level ${spellLvl}</h3>`;
                itemHeader += `<span class="spell-slots" style="display:inline; margin-left:10px;">`;
                itemHeader += `<input type="text" ${inputStyle} data-target="data.spells.spell${spellLvl}.value" value="${spellslot}" placeholder="0"/>`;
                itemHeader += `/`;
                itemHeader += `<input type="text" ${inputStyle} data-target="data.spells.spell${spellLvl}.max" value="${spellMax}" placeholder="0"/>`;
                itemHeader += `</span>`;
                itemHeader += `</li>`;
                itemHeader = $(itemHeader);

                // creating event for changing spell slot amount
                itemHeader.find('input').change(ev => {
                    let target = ev.target.dataset.target;
                    $(html.find(`input[name="${target}"]`)).val(ev.target.value).trigger('submit', ev);
                    openFavouriteTab(app, html, data);
                });
            }

            favSpellOl.append(itemHeader);
            for (let item of favSpells[spellLvl]) {
                let itemLi = createItemElement(item, app, html, data);
                favSpellOl.append(itemLi);
            }

        }
    }

    // changing some css in the sheet to acomodate the new favourite button
    if (app.options.editable) {
        html.find('.spellbook .item-controls').css('flex', '0 0 88px');
        html.find('.inventory .item-controls, .feats .item-controls').css('flex', '0 0 66px');
        html.find('.favourite .item-controls').css('flex', '0 0 22px');
    }

    // finish up building the favourite div and add it and the coresponding tab-button
    favTabDiv.append(favItemOl);
    favTabDiv.append(favFeatOl);
    favTabDiv.append(favSpellOl);

    let tabs = html.find('.sheet-tabs[data-group="primary"]');
    favTabDiv.insertAfter(tabs);
    tabs.prepend(favTabBtn);
});

function createItemElement(item, app, html, data) {
    let itemLi = `<li class="item fav-item" data-item-id="${item.id}">`
    itemLi += `<div class="item-name rollable">`;
    itemLi += `<div class="item-image" style="background-image: url(${item.img})"></div>`;
    itemLi += `<h4>${item.name}</h4>`;
    itemLi += `</div>`;
    itemLi += `<div class="charges" style="flex:0 0 80px">`;
    if (item.data.charges !== undefined && item.data.charges.max !== 0) {
        let inputStyle = 'style="height:1em; width:2em; margin:0 1px; padding:0;"';
        itemLi += `<span style="display:inline;">(</span>`;
        itemLi += `<input data-type="value" type="text" ${inputStyle} value="${item.data.charges.value}" ${app.options.editable ? "" : "disabled"}>`;
        itemLi += `<span style="display:inline;">/</span>`;
        itemLi += `<input data-type="max" type="text" ${inputStyle} value="${item.data.charges.max}" ${app.options.editable ? "" : "disabled"}>`;
        itemLi += `<span style="display:inline;">)</span>`;
    } else {
        if (app.options.editable) {
            itemLi += `<a class="addCharges" value="Add Charges">Add Charges</a>`
        }
    }
    itemLi += `</div>`;
    itemLi += `<div class="item-controlls" style="flex:0 0 22px;">`;
    itemLi += `<a class="item-control item-fav" title="remove from favourites" > <i class="fas fa-sign-out-alt" ></i ></a >`;
    itemLi += `</div>`;
    itemLi += `</li>`;
    itemLi = $(itemLi);

    // Activating favourite-list events

    // showing item summary
    itemLi.find('.item-name h4').click(event => app._onItemSummary(event));

    // the rest is only needed if the sheet is editable
    if (!app.options.editable) return itemLi;

    // rolling the item
    itemLi.find('.item-image').click(event => app._onItemRoll(event));

    // removing item from favourite list
    itemLi.find('.item-fav').click(ev => {
        item.flags.favtab.isFavourite = !item.flags.favtab.isFavourite;
        app.actor.updateOwnedItem(item, true);
        openFavouriteTab(app, html, data);
    });

    // changing the charges values (removing if both value and max are 0)
    itemLi.find('.charges input').change(ev => {
        item.data.charges[ev.target.dataset.type] = Number(ev.target.value);
        app.actor.updateOwnedItem(item, true);
        openFavouriteTab(app, html, data);
    })

    // creating charges for the item
    itemLi.find('.addCharges').click(ev => {
        item.data.charges = { value: 1, max: 1 };
        app.actor.updateOwnedItem(item, true);
        openFavouriteTab(app, html, data);
    });

    // hiding the "add charges" button and only showing it when in the apropiate item
    itemLi.find('.addCharges').hide();
    itemLi.hover(evIn => {
        itemLi.find('.addCharges').show();
    }, evOut => {
        itemLi.find('.addCharges').hide();
    });
    
    return itemLi;
}

// function to return to the favourite tab after rerendering of the sheet
// this is required since the sheet cant reopen an injected tab after rerendering
function openFavouriteTab(app, html, data) {
    setTimeout(() => {
        console.log(app);
        $(`.app[data-appid="${app.appId}"] .tabs .item[data-tab="favourite"]`).trigger('click');
    }, 50);
}