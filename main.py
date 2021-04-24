import pandas as pd
import xlwings as xw

# Open excel workbook
wb = xw.Book('cool-food-pledge-calculator_0.xlsx')
# Get the calculator input sheet
input_sheet = wb.sheets[1]
# Get the calculator output sheet
output_sheet = wb.sheets[2]
# Load the survey
survey_df = pd.read_csv("Food Choices Form.csv")

mapped_foods = {
    6: "Beef / buffalo",
    7: "Lamb / goat",
    9: "Pork",
    10: "Poultry (chicken, turkey, or any other bird meats)", 
    20: "Fish (finfish)", 
    21: "Crustaceans (e.g., shrimp, prawns, crabs, lobster)", 
    22: "Mollusks (e.g., clams, oysters, squid, octopus)", 
    12: "Butter",
    13: "Cheese",
    14: "Ice cream", 
    15: "Cream", 
    16: "Milk (cow's milk)",
    17: "Yogurt", 
    18: "Eggs",
    56: "Potatoes",
    57: "Cassava / Other roots", 
    60: "Soybean oil", 
    61: "Palm oil", 
    62: "Sunflower oil",
    63: "Rapeseed / canola oil", 
    64: "Olive oil", 
    66: "Beer", 
    67: "Wine", 
    70: "Coffee (Ground or whole bean)", 
    58: "Sugar" 
}

user_foods_df = survey_df[mapped_foods.values()]

for i, user in user_foods_df.iterrows():
    # Insert data for each sample into calculator
    # Using only the 2015 column
    for index in range(6, 72):
        current_cell = 'B' + str(index)
        if index in mapped_foods:
            csv_food_name = mapped_foods[index]
            input_sheet.range(current_cell).value = user[csv_food_name]
        else:
            cell_value = input_sheet.range(current_cell).value
            if cell_value != None:
                input_sheet.range(current_cell).value = 0

    # Get important updated output totals or whatever from the output sheet
    # Metric 1 Total is cell B70
    # Metric 2 Total is cell G70
    # Metric 3 Total is cell L70
    # Metric 4 Total is cell Q70
    # Metric 2 + 4 Total is cell V70
    # Metric 5 Total is cell AA70 



