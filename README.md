# Favourite Item Tab

Adds a Favourite tab to display a customized list of items, feats and spells. Usable with the default dnd5e Character sheet.
You can add any item from the inventory, spellbook or feature section of the Charactersheet.

> This version only works for Foundry v0.4.4 and up. To use the previous version please visit https://github.com/syl3r86/favtab/tree/pre-0.4.4

## Installation
1. Copy this link and use it in Foundrys Module Manager to install the Module

    > https://raw.githubusercontent.com/syl3r86/favtab/master/module.json
    
2. Enable the Module in your Worlds Module Settings

![example](preview.jpg)

Once you marked at least one item as favourite, the tab will show up and offer the new possibilitys.
If you have any suggestions or problems concerning this module, feel free to contact me in discord (Felix#6196) or per email (syl3r31@gmail.com).

## Notice for Sheet Developers
If you are developing a sheet and want to strictly disable favtab for your sheet, you can do that by including `blockFavTab=true` in your sheet classes options (in the `static get defaultOptions` function for example). You can see this implementation in my Better NPC Sheet (https://github.com/syl3r86/BetterNPCSheet5e/blob/master/betternpcsheet.js line 34).

Favtab will also check if the nessessary html elements are present to ensure compability.

## Contribution
If you feel like supporting my work, feel free to leave a tip at my paypal felix.mueller.86@web.de

## License
<a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons Licence" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">Favourite Item Tab - a module for Foundry VTT -</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="https://github.com/syl3r86?tab=repositories" property="cc:attributionName" rel="cc:attributionURL">Felix Müller</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.

This work is licensed under Foundry Virtual Tabletop [EULA - Limited License Agreement for module development](https://foundryvtt.com/article/license/).
