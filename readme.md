![menu](https://raw.githubusercontent.com/swkeep/keep-input/master/.github/test-one.PNG)

This is a modified version of **[vC-input](https://github.com/vCodeScripts/vC-input)** by **[vCodeScripts](https://github.com/vCodeScripts)**

## Changes

- Some functions have been rewritten to be compatible with qb input
- I still need to add somemissing inputs like(checkbox and radiobox)
- Removed notification function and added it to NUI itself
- It will highlights required items with `*`

```lua
   local inputData, reason = exports['keep-input']:ShowInput({
     -- background_color = 'red',
     -- submitText = 'SEND', -- will be show as if not used 'ACCEPT'
        inputs = {
            {
                type = 'number',
                isRequired = true, -- or required both are valid
                name = 'cost_of_rental',
                text = 'price for renting this booth?', -- some elements has this value as their placeholder
                icon = 'fa-solid fa-money-bill-trend-up',
                title = 'Rental Cost' -- If there is no title, the name is used as the title
            },
                {
                type = 'password',
                isRequired = true,
                name = 'password',
                text = 'ENTER PASSWORD',
                icon = 'fa-solid fa-money-bill-trend-up',
                title = 'Password'
            },
            {
                text = "Some Select", -- text you want to be displayed as a input header
                name = "someselect", -- name of the input should be unique otherwise it might override
                type = "select", -- type of the input - Select is useful for 3+ amount of "or" options e.g; someselect = none OR other OR other2 OR other3...etc
                options = { -- Select drop down options, the first option will by default be selected
                    { value = "none", text = "None" }, -- Options MUST include a value and a text option
                    { value = "other", text = "Other" }, -- Options MUST include a value and a text option
                    { value = "other2", text = "Other2" }, -- Options MUST include a value and a text option
                    { value = "other3", text = "Other3" }, -- Options MUST include a value and a text option
                    { value = "other4", text = "Other4" }, -- Options MUST include a value and a text option
                    { value = "other5", text = "Other5" }, -- Options MUST include a value and a text option
                    { value = "other6", text = "Other6" }, -- Options MUST include a value and a text option
                },
                -- default = 'other3', -- Default select option, must match a value from above, this is optional
            }
        }
    })
    print(inputData.someselect ,inputData.cost_of_rental, reason)

```
