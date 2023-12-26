subcategory_images = {'Notebooks': {
    'Apple': ['images/Apple_MacBook_Pro_16_M3', 'images/Apple_MacBook_Pro_M3', 'images/apple_macbook_air_13_m'],
    'ASUS': ['images/asus_rog_strix', 'images/asus_vivobook_15', 'images/asus_zenbook', 'images/asus_tuf_gaming',
             'images/asus_laptop'],
    'HP': ['images/HP_Laptop_15s-fq5000ua', 'images/HP_ProBook_440_G9', 'images/hp-8f2b8ea'],
    'Acer': ['images/acer_aspire', 'images/acer_extensa', 'images/acer_predator', 'images/acer_travelMate'],
    'Lenovo': ['images/Lenovo_IdeaPad_Gaming_3_15IHU6', 'images/Lenovo_Legion_T5_26ARA8'],
    'DELL': ['images/Dell_XPS_15_9530', 'images/Dell_XPS_17_9720']},
    'Computers': {'Apple': ['images/Apple_Mac_Mini_M2_Pro', 'images/Apple_M2_Ultra__RAM_64_ГБ__S'],
                  'ASUS': ['images/ASUS_ROG_Strix_GA15DK', 'images/ASUS_ROG_Strix_GA15DK_LRVNSs0'],
                  'Acer': ['images/acer_veriton_VX2680G', 'images/Acer_Veriton_X2631G'],
                  'Lenovo': ['images/Lenovo_Legion_T5_26ARA8', 'images/Lenovo_ThinkCentre_M93p_Tower']},
    'Monitors': {'ARTLINE': ['images/artline_monitor'],
                 'MSI': ['images/msi_monitor', 'images/msi_gaming_monitor', 'images/msi_gaming_g274qpx'],
                 'HUAWEI': ['images/Huawei_MateView_GT', 'images/HUAWEI_MateView_GT_Standard'],
                 'HP': ['images/HP_Omen_32c', 'images/HP_Omen_32c'],
                 'Acer': ['images/Acer_Nitro_VG240YM3bmiipx', 'images/HP_E27m_G4']}, 'TV-cables': {
        'Apple': ['images/Apple_USB_C_to_Lightning_Cable_1', 'images/Apple_AV_адаптер_USB_C',
                  'images/Apple_USB_C_Woven_Charge_Cable_1']},
    'Tablets': {'Xiaomi': ['images/Xiaomi_Pad_6', 'images/Xiaomi_Pad_5', 'images/Xiaomi_Pad_6_Gold'],
                'Samsung': ['images/Samsung_Galaxy_Tab_S9', 'images/Samsung_Galaxy_Tab_A8']}, 'Power-banks': {
        'HUAWEI': ['images/Huawei_SuperCharge', 'images/Huawei_SuperCharge_Universal', 'images/HUAWEI_iSitePower_M'],
        'Xiaomi': ['images/Xiaomi_Mi_Power_Bank', 'images/Mi_Powerbank_3']},
    'TV': {'Nokia': ['images/Nokia_Smart_TV_QLED', 'images/NOKIA_Smart_TV_QLED_5500D'],
           'SONY': ['image6/Sony_KD55X75WLE33', 'images/Sony_XR65X90KR2'],
           'LG': ['images/LG_OLED55C36LC', 'images/LG_50QNED756RA'],
           'Samsung': ['images/Samsung_QE55S90CAUXUA', 'images/Samsung_UE55CU8500UXUA',
                       'images/Samsung_The_Serif_QE43LS01BAUXUA', 'images/Samsung_QE50LS01BAUXUA']},
    'Smartphones': {'HUAWEI': ['images/Huawei_P30_Pro', 'images/Huawei_P40_Pro'],
                    'Nokia': ['images/Nokia_G22', 'images/Nokia_G42'],
                    'Xiaomi': ['images/Xiaomi_Redmi_Note_12_Pro', 'images/Xiaomi_Redmi_Note_12'],
                    'SONY': ['images/Sony_Xperia_1_V', 'images/_Sony_Xperia_Pro-I'],
                    'LG': ['images/_LG_G9_G900N', 'images/LG_G9_VELVET'],
                    'Samsung': ['images/Samsung_Galaxy_S23_Ultra', 'images/Samsung_Galaxy_Fold_5'],
                    'Apple': ['images/Apple_iPhone_15', 'images/Apple_iPhone_14_Pro_Max']},
    'Gaming-consoles': {'RAZER': ['images/Razer_Edge_Gaming_Tablet_+_Kishi'],
                        'PlayStation': ['images/PlayStation_5_Ultra_HD_Blu-ray', 'images/Sony_Playstation_4_Slim',
                                        'images/Sony_PlayStation_5_White_Digital_Edition_+_EA',
                                        'images/Sony_PlayStation_5_Digital_Edition_825GB_God_of_War_Ragnarok_Bundle']},
    'Gaming-notebooks': {'RAZER': ['images/Razer_Book_13_EVO_Creator', 'images/RAZER_Blade_16'],
                         'Acer': ['images/Acer_Nitro_5_AN517-54-72WJ', 'images/Acer_Predator_Helios_300'],
                         'ASUS': ['image/ASUS_ROG_Strix_G17_2023']}, 'Games': {
        'PlayStation': ['image/EA_SPORTS_FC_24', 'images/The_Last_of_Us_Part_I',
                        'images/Mortal_Kombat_1', 'images/Need_for_Speed_Unbound',
                        "images/Assassin's_Creed_Mirage_Launch_Edition"]},
    'Gaming-chairs': {'RAZER': ['images/Razer_Iskur', 'images/Razer_Enki_X_Green']}}


def replace_spaces_with_underscores_recursive(data):
    if isinstance(data, list):
        # Если это список, рекурсивно вызываем функцию для каждого его элемента
        return [replace_spaces_with_underscores_recursive(item) for item in data]
    elif isinstance(data, dict):
        # Если это словарь, рекурсивно вызываем функцию для каждого его значения
        return {key: replace_spaces_with_underscores_recursive(value) for key, value in data.items()}
    elif isinstance(data, str):
        # Если это строка, заменяем пробелы на подчеркивания
        return data.replace(' ', '_')
    else:
        # Возвращаем неизмененный объект для других типов данных
        return data


# Заменяем пробелы на подчеркивания в словаре
# subcategory_images = replace_spaces_with_underscores_recursive(subcategory_images)

# print(subcategory_images)


def add_webp_extension_recursive(data):
    if isinstance(data, list):
        # Если это список, рекурсивно вызываем функцию для каждого его элемента
        return [add_webp_extension_recursive(item) for item in data]
    elif isinstance(data, dict):
        # Если это словарь, рекурсивно вызываем функцию для каждого его значения
        return {key: add_webp_extension_recursive(value) for key, value in data.items()}
    elif isinstance(data, str):
        # Если это строка, добавляем ".webp" в конец
        return data + '.webp'
    else:
        # Возвращаем неизмененный объект для других типов данных
        return data


# Добавляем ".webp" в конец каждой строки в словаре
subcategory_images = add_webp_extension_recursive(subcategory_images)

# Печатаем обновленный словарь
print(subcategory_images)
