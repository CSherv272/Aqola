class Cleansing:
    # list of postcodes in Kent from: https://www.postcode-info.co.uk/kent-postcodes-376.html
    KENT_POSTCODE_DISTRICTS = ["BR6", "BR8",
        "CT1", "CT10", "CT11", "CT12", "CT13", "CT14", "CT15", "CT16", "CT17", "CT18", "CT19",
        "CT2", "CT20", "CT21", "CT3", "CT4", "CT5", "CT6", "CT7", "CT8", "CT9",
        "DA1", "DA10", "DA11", "DA12", "DA13", "DA2", "DA3", "DA4", "DA9",
        "ME1", "ME10", "ME11", "ME12", "ME13", "ME14", "ME15", "ME16", "ME17", "ME18", "ME19",
        "ME2", "ME20", "ME3", "ME4", "ME5", "ME6", "ME7", "ME8", "ME9",
        "TN1", "TN10", "TN11", "TN12", "TN13", "TN14", "TN15", "TN16", "TN17", "TN18",
        "TN2", "TN23", "TN24", "TN25", "TN26", "TN27", "TN28", "TN29", "TN3", "TN30", "TN4", "TN8", "TN9"]
    
    KENT_LAD_CODES = [
        'E07000105', 'E07000106', 'E07000107', 'E07000108',
        'E07000112', 'E07000109', 'E07000110', 'E06000035',
        'E07000111', 'E07000113', 'E07000114', 'E07000115',
        'E07000116',
    ]