import pandas as pd
import xlwings as xw


class Processor():
    # Shared food keys between calculator and survey data
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

    # Only columns in the calculator we will be looking at
    mapped_columns = {
        'B': 'Metric 1 (kg)', 
        'G': 'Metric 2 (CO2)', 
        'L': 'Metric 3 (ha)', 
        'Q': 'Metric 4 (CO2)', 
        'V': 'Metric 2 + 4 (CO2)', 
        'AA': 'Metric 5 (millions of kcal)'
    }

    def __init__(self):
        # Open excel workbook
        self.wb = xw.Book('cool-food-pledge-calculator_0.xlsx')
        # Get the calculator input sheet
        self.input_sheet = self.wb.sheets[1]
        # Get the calculator output sheet
        self.output_sheet = self.wb.sheets[2]
        # Load the survey
        self.survey_df = pd.read_csv("Food Choices Form.csv")

    def calculate(self, cell_lst):
        additional_columns = self.__construct_columns(cell_lst)

        for i, user in self.survey_df.iterrows():
            # Insert data for each sample into calculator
            # Using only the 2015 column
            for index in range(6, 72):
                current_cell = 'B' + str(index)
                if index in self.mapped_foods:
                    csv_food_name = self.mapped_foods[index]
                    value = user[csv_food_name]
                    if user.iloc[1] == 'Pounds (lbs)':
                        # Need to do conversion since output is in kg
                        value *= 0.4536
                    self.input_sheet.range(current_cell).value = value
                else:
                    cell_value = self.input_sheet.range(current_cell).value
                    if cell_value != None:
                        self.input_sheet.range(current_cell).value = 0

            # Get important updated output totals or whatever from the output sheet
            for cell in additional_columns.keys():
                additional_columns[cell][1].append(self.output_sheet.range(cell).value)

        # Finally create the new rows
        for col_name, col_vals in additional_columns.values():
            self.survey_df[col_name] = col_vals

    def tidy_data(self):
        # Change NaN values for foods to be 0
        for food in self.mapped_foods.values():
            self.survey_df[food].fillna(0, inplace=True)

        # Change NaN values for certain questions to 'no'
        self.survey_df['Are you involved in any sustainability groups on campus? If so, which ones? (groups on campus: https://sustainability.umd.edu/get-involved/students/student-groups)'].fillna('no', inplace=True)
        self.survey_df['Have you worked on a project that is sustainability or carbon footprint related? If so, explain.'].fillna('no', inplace=True)

        # # Fill in missing data in dataframe
        # with pd.option_context('display.max_rows', None, 'display.max_columns', None):  # more options can be specified also
        #     print(survey_df)

    def __construct_columns(self, cell_lst):
        additional_columns = {}
        for col_letter, row_num in cell_lst:
            title = self.__get_title(col_letter, int(row_num))
            additional_columns[col_letter + row_num] = (title, [])
        return additional_columns

    def __get_title(self, col_letter, row_num):
        title = self.mapped_columns[col_letter]
        if row_num >= 3 and row_num <= 70:
            # In individual foods section
            title += ':Food:'
        elif row_num >= 94 and row_num <= 109:
            # In food category section 
            title += ':Category:'
        
        title += self.output_sheet.range('A' + str(row_num)).value
        return title


if __name__ == "__main__":
    processor = Processor()
    # Currently, only individual food totals are included
    included_cells = [('B', '70'), ('G', '70'), ('L', '70'), ('Q', '70'), ('V', '70'), ('AA', '70')]
    processor.tidy_data()
    processor.calculate(included_cells)

    # Output to 'data' folder in the root directory
    processor.survey_df.to_csv('../data/formatted-data.csv', index=False)



