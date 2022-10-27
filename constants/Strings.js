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
            titles: /[^\wÀ-ÖØ-öø-ÿ'\- _/&:!]/,
            units: /[^A-Za-zÀ-ÖØ-öø-ÿ ]/,
            numbers: /[^0-9]/,
        },
    },
    English: {
        buttons: {
            settings: "Settings",
            loginWithEmail: "Log In With Email",
            save: "Save",
            delete: "Delete",
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
        label: {
            login: "Log in to Begin",
            prodName: "Product Name: ",
            time: "Average Time to Make: ",
            number: "Items: ",
            hour: "H: ",
            minute: "M: ",
            amount: "#: ",
            wage: "Wage per Hour",
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
            ingNameBadChar: "Ingredient names can only contain letters, numbers, spaces, and these symbols: '-_/&:!",
            ingUnitTooShort: "Your ingredient needs a unit of measurement. How do you count it? By item, pair, skein, box, bottle...",
            ingUnitBadChar: "Your ingredient can't contain special characters",
            ingCostZero: "Your ingredient should have a cost. Even if you didn't pay for it, look up what it would cost to buy.",
            ingPerItem: "How much of this ingredient do you use to make one of this product? You're counting by *unit*."
        },
        hint: {
            amount: "If it takes more than one hour to produce one, we recommend setting amount to 1"
        },
        placeholder:  {
            email: "email@example.com",
            password: "password",
            prodName: "What is your product called?",
            ingName: "What is the ingredient called?",
            ingUnit: "bottle, skein, sheet, unit, etc.",
            ingCost: "0.00",
            ingPerItem: "0",
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