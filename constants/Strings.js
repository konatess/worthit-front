export default {
    util: {
        languages: ["English", "Espanñol"],
        keys: {
            settings: "USER_SETTINGS",
            prodPrefix: "PROD-",
            ingPrefix: "ING-"
        },
        routes: {
            login: "Login",
            home: "Home",
            settings: "Settings",
            recipe: "Recipe"
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
    },
    English: {
        buttons: {
            settings: "Settings",
            loginWithEmail: "Log In With Email",
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
            allSettings: {
                darkMode: "Dark Mode On/Off",
                language: "Language",
                dateFormat: "Date Format:  ",
                delete: "Start Fresh - Delete All Projects",
                feedback: "Send Us Your Feedback",
                site: "Visit Our Website",
                logout: "Log out"
            }
        },
        headers: {
            recipes: "Product Recipes",
            ingredients: "All Ingredients"
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
            profPercent: " %",
            ingredients: "Ingredients: ",
            newIngredient: "Create new Ingredient:",
            ingName: "Name: ",
            ingUnit: "Unit: ",
            ingCost: "Cost: ",
            ingPerItem: "Amount: ",
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
            ingredientsAmounts: "Please set amounts for ingredients, or remove them from the list"
        },
        hint: {
            amount: "If it takes more than one hour to produce one, we recommend setting amount to 1"
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
    Espanñol: {
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