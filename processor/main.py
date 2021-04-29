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

# Change NaN values for foods to be 0
for food in mapped_foods.values():
    survey_df[food].fillna(0, inplace=True)

# Change NaN values for certain questions to 'no'
survey_df['Are you involved in any sustainability groups on campus? If so, which ones? (groups on campus: https://sustainability.umd.edu/get-involved/students/student-groups)'].fillna('no', inplace=True)
survey_df['Have you worked on a project that is sustainability or carbon footprint related? If so, explain.'].fillna('no', inplace=True)

# # Fill in missing data in dataframe
# with pd.option_context('display.max_rows', None, 'display.max_columns', None):  # more options can be specified also
#     print(survey_df)

# If we want to add more columns to the final dataset, just find the cell number and enter a column name
additional_columns = {
    'B70': ('Metric 1 Total (kg)', []),
    'G70': ('Metric 2 Total (CO2)', []),
    'L70': ('Metric 3 Total (ha)', []),
    'Q70': ('Metric 4 Total (CO2)', []),
    'V70': ('Metric 2 + 4 Total (CO2)', []),
    'AA70': ('Metric 5 Total (millions of kcal)', []),
}

# Begin getting values from the calculator
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
    for cell in additional_columns.keys():
        additional_columns[cell][1].append(output_sheet.range(cell).value)

# Finally create the new rows
for col_name, col_val in additional_columns.values():
    survey_df[col_name] = col_val

# Output to 'data' folder in the root directory
survey_df.to_csv('../data/formatted-data.csv', index=False)



