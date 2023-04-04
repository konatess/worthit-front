export default {
    util: {
        languages: ["English", "Español"],
        currencies: ["$", "£", "€"],
        logins: ["local", "newFirebase", "Facebook", "Google", "email"],
        keys: {
            allIng: 'ALLINGREDIENTS',
            allRec: 'ALLRECIPES',
            settings: 'SETTINGS',
        },
        routes: {
            login: "Login",
            home: "Home",
            settings: "Settings",
            recipe: "Recipe",
            purchase: "Purchase"
        },
        mailto: "mailto:<admin@buddingapps.com>?subject=Worth%20It%20App",
        website: "https://www.buddingapps.com/projects/divide-%26-de-stress",
        dateFormats: ["MM/DD", "DD/MM", "MM-DD", "DD-MM", "YY/MM/DD", "DD/MM/YY", "MM/DD/YY", "YY-MM-DD", "DD-MM-YY", "MM-DD-YY"],
        regex: {
            titles: /[^\wÀ-ÖØ-öø-ÿ'\- _/&:!()]/,
            notes: /[^\wÀ-ÖØ-öø-ÿ'\- _/&:!(),.?\n]/,
            units: /[^A-Za-zÀ-ÖØ-öø-ÿ ]/,
            numbers: /^([0-9\.]+)$/,
        },
        entitlements: {
            storage1: "10x_storage"
        },
    },
    English: {
        buttons: {
            settings: "Settings",
            loginWithEmail: "Log In With Email",
            signInGoogle: "Sign In With Google",
            restoreP: "Restore Purchases",
            products: "Products", 
            ingredients: "Ingredients",
            save: "Save",
            delete: "Delete",
            remove: "Remove",
            create: "New",
            cancel: "Cancel",
            done: "Done",
            okay: "Okay",
            duplicate: "Duplicate",
            setToDefault: "Set to Default",
            addIngredient: "Add Ingredients",
            newIngredient: "New Ingredient",
            calcIngredients: "Calculate Ingredients Needed",
            yes: "Yes",
            no: "No",
            allSettings: {
                darkMode: "Dark Mode On/Off",
                // currency: "Currency"
                // language: "Language",
                // profitPrioritizeAmount: "Prioritize profit amount over percent: ",
                subscriptions: "Manage Subscriptions",
                deleteRec: "Start Fresh - Delete All Recipes",
                deleteIng: "Start Fresh - Delete All Ingredients",
                overwriteLocal: "Overwrite Local Data with Database",
                overwriteRemote: "Overwrite Database with Local Data",
                logout: "Log out",
                feedback: "Send Us Your Feedback",
                site: "Visit Our Website"
            }
        },
        headers: {
            recipes: "Product Recipes",
            ingredients: "All Ingredients",
            errorAlert: "Error: ",
        },
        label: {
            login: "Log in to Begin",
            prodName: "Product Name: ",
            prodNote: "Notes: ",
            time: "Average Time to Make: ",
            number: "Items: ",
            hour: "H: ",
            minute: "M: ",
            amount: "#: ",
            wage: "Wage per Hour: $ ",
            profit: "Profit: ",
            profAmount: "$ ",
            profPercent: " % of Cost",
            ingredients: "Ingredients: ",
            newIngredient: "Create new Ingredient:",
            ingName: "Name: ",
            ingUnit: "Unit: ",
            ingCost: "Cost: ",
            ingPerItem: "Amount: ",
            inventory: "Inventory: ",
            price: "Price: ",
            numProducts: "For # of Product: ",
            ingTableNeed: "Need:",
            ingTableHave: "Have:"
        },
        messages: {
            ingredients: "Choose an ingredient: ",
            ingNameTooShort: "Your ingredient needs a name",
            ingNameBadChar: "Ingredient names can only contain letters, numbers, spaces, and these symbols: '-_/&:!()",
            ingUnitTooShort: "Your ingredient needs a unit of measurement. How do you count it? By item, pair, skein, box, bottle...",
            ingUnitBadChar: "Unit names can't contain special characters",
            ingCostZero: "Your ingredient should have a cost. Even if you didn't pay for it, look up what it would cost to buy.",
            ingPerItem: "How much of this ingredient do you use to make one of this product? You're counting by *unit*.",
            prodNameShort: "Your product needs a name",
            prodNameBadChar: "Product names can only contain letters, numbers, spaces, and these symbols: '-_/&:!()",
            prodNoteBadChar: "Product notes can only contain letters, numbers, spaces, returns, and these symbols: '-_/&:!(),.?",
            prodTime: "Please set a time of at least one minute and less than 100 hours",
            prodAmount: "Please set an amount greater than 0 and less than 1,000,000",
            ingredientsAmounts: "Please set amounts for ingredients, or remove them from the list",
            deleteAllIng: "Are you sure you want to delete all your ingredients? This cannot be undone.",
            deleteAllRec: "Are you sure you want to delete all your recipes? This cannot be undone.",
            overwriteLocal: "Are you sure you want to overwrite your local data with your database data? This cannot be undone.",
            overwriteRemote: "Are you sure you want to overwrite your database data with your local data? This cannot be undone.",
            overwriteInProgress: "Saving overwrite...",
            updateIng: "You have increased your product inventory. Would you like to subtract ingredients from your inventory?",
            amount: "The time and amount determine how much of your hourly wage to add to the price. It's better to round up the time than to round it down.",
            wage: "You deserve to be paid a living wage. If you make this product yourself, the wage is what you should pay yourself for time spent making this specific product. If you pay an employee to make this product, put their wage here.",
            profit: "Your business needs profit that is separate from the hourly wage above. This number should be high enough to cover:\n• expected expenses tied to each product such as fees from credit card purchases or sales platforms\n• expected general expenses such as subscription fees which are spread over all your sales\n• and still have some left over for unexpected expenses.\nIf all of that feels too overwhelming or unpredictable, just calculate the expected expenses tied to this product and double that amount. You can always update this later",
            inventory: "This is the number of this product you have in inventory now, created but not sold. This number can be 0. Use the 'Calculate Ingredients Needed' button below to see how much of your ingredients you would need to make # more of this product, and how much of each ingredient you already have.",
            ingInfo: "Use the 'Add Ingredients' button to choose ingredients needed for this recipe, then touch each ingredient to update the quantity."
        },
        placeholder:  {
            email: "email@example.com",
            password: "password",
            prodName: "What is your product called?",
            prodNote: "Any additional information you'd like to keep with this product recipe...",
            ingName: "What is the ingredient called?",
            ingUnit: "bottle, skein, sheet, unit, etc.",
            ingCost: "0.00",
            ingPerItem: "0",
            duplicate: "_Copy"
        },
    },
    Español: {
        buttons: {
            settings: "Ajustes",
            save: "Guardar",
            delete: "Quitar",
            create: "Nuevo",
            cancel: "Cancelar",
            done: "Realizar",    
            okay: "Okay",
            setToDefault: "Establecer por Defecto",
            allSettings: {
                darkMode: "Modo Oscuro Encender/Apagar",
                language: "Idioma",
                dateFormat: "Formato de Fecha:  ",
                delete: "Quitar Todos los Proyectos",
                feedback: "Envíenos Sus Comentarios",
                site: "Visite Nuestra Pagina Web"
            }
        }
    }
}