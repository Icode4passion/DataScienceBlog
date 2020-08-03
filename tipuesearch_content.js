var tipuesearch = {"pages":[{"title":"Article One","text":"Zen of Python Beautiful is better than ugly. Explicit is better than implicit. Simple is better than complex. Complex is better than complicated. Flat is better than nested. Sparse is better than dense. Readability counts. Special cases aren't special enough to break the rules. Although practicality beats purity. Errors should never pass silently. Unless explicitly silenced. In the face of ambiguity, refuse the temptation to guess. There should be one-- and preferably only one --obvious way to do it. Although that way may not be obvious at first unless you're Dutch. Now is better than never. Although never is often better than right now. If the implementation is hard to explain, it's a bad idea. If the implementation is easy to explain, it may be a good idea. Namespaces are one honking great idea -- let's do more of those!","tags":"Python","url":"/my-first-article.html","loc":"/my-first-article.html"},{"title":"Avocados Project","text":"In [151]: import pandas as pd import numpy as np import pylab as pl import matplotlib.pyplot as pl import seaborn as sns In [152]: data = pd . read_csv ( \"./avocado.csv\" ) data [ 'Date' ] = pd . to_datetime ( data [ 'Date' ]) data . head () Out[152]: Unnamed: 0 Date AveragePrice Total Volume 4046 4225 4770 Total Bags Small Bags Large Bags XLarge Bags type year region 0 0 2015-12-27 1.33 64236.62 1036.74 54454.85 48.16 8696.87 8603.62 93.25 0.0 conventional 2015 Albany 1 1 2015-12-20 1.35 54876.98 674.28 44638.81 58.33 9505.56 9408.07 97.49 0.0 conventional 2015 Albany 2 2 2015-12-13 0.93 118220.22 794.70 109149.67 130.50 8145.35 8042.21 103.14 0.0 conventional 2015 Albany 3 3 2015-12-06 1.08 78992.15 1132.00 71976.41 72.58 5811.16 5677.40 133.76 0.0 conventional 2015 Albany 4 4 2015-11-29 1.28 51039.60 941.48 43838.39 75.78 6183.95 5986.26 197.69 0.0 conventional 2015 Albany In [153]: #data.describe() #data.isnull().sum() data . dtypes Out[153]: Unnamed: 0 int64 Date datetime64[ns] AveragePrice float64 Total Volume float64 4046 float64 4225 float64 4770 float64 Total Bags float64 Small Bags float64 Large Bags float64 XLarge Bags float64 type object year int64 region object dtype: object LabelEncoder encode labels with a value between 0 and n_classes-1 where n is the number of distinct labels In [154]: from sklearn.preprocessing import LabelEncoder label = LabelEncoder () dicts = {} label . fit ( data [ 'type' ] . drop_duplicates ()) dicts [ 'type' ] = list ( label . classes_ ) data [ 'type' ] = label . transform ( data [ 'type' ]) label . fit ( data [ 'region' ] . drop_duplicates ()) dicts [ 'region' ] = list ( label . classes_ ) data [ 'region' ] = label . transform ( data [ 'region' ]) #data.tail() In [155]: from sklearn.ensemble import RandomForestClassifier from sklearn.metrics import precision_recall_curve from sklearn.model_selection import train_test_split from sklearn import cross_validation from sklearn.neighbors import KNeighborsClassifier from sklearn.ensemble import RandomForestClassifier from sklearn.linear_model import LogisticRegression from sklearn.metrics import roc_curve , auc import warnings warnings . filterwarnings ( 'ignore' ) x = data . drop ([ 'Date' , 'type' ], axis = 1 ) y = data [ 'type' ] x_train , x_test , y_train , y_test = train_test_split ( x , y , random_state = 0 ) In [156]: logreg = LogisticRegression ( penalty = 'l1' , tol = 0.0001 ) . fit ( x_train , y_train ) print ( \"LogisticRegression train data score: {:.3f} \" . format ( logreg . score ( x_train , y_train ))) print ( \"LogisticRegression test data score: {:.3f} \" . format ( logreg . score ( x_test , y_test ))) LogisticRegression train data score:0.948 LogisticRegression test data score:0.948 In [158]: rf = RandomForestClassifier ( n_estimators = 100 , random_state = 0 , max_features = 2 ) rf . fit ( x_train , y_train ) precision_rf , recall_rf , thresholds_rf = precision_recall_curve ( y_test , rf . predict_proba ( x_test )[:, 1 ]) pl . plot ( precision_rf , recall_rf , label = 'RF' , color = 'c' ) close_default_rf = np . argmin ( np . abs ( thresholds_rf - 0.5 )) pl . plot ( precision_rf [ close_default_rf ], recall_rf [ close_default_rf ], '&#94;' , c = 'k' , markersize = 10 , label = \"Treshold 0.5 RF\" , fillstyle = \"none\" , mew = 2 ) pl . xlabel ( \"Precision\" ) pl . ylabel ( \"Recall\" ) pl . legend ( loc = \"best\" ) pl . show () In [160]: kfold = 10 result = {} trn_train , trn_test , trg_train , trg_test = cross_validation . train_test_split ( x , y , test_size = 0.25 ) knn = KNeighborsClassifier ( n_neighbors = 200 ) log_reg = LogisticRegression ( penalty = 'l1' , tol = 0.001 ) scores = cross_validation . cross_val_score ( knn , x , y , cv = kfold ) result [ 'KNeighborsClassifier' ] = scores . mean () scores = cross_validation . cross_val_score ( log_reg , x , y , cv = kfold ) result [ 'LogisticRegression' ] = scores . mean () pl . clf () knn_result = knn . fit ( trn_train , trg_train ) . predict_proba ( trn_test ) fpr , tpr , thresholds = roc_curve ( trg_test , knn_result [:, 1 ]) roc_auc = auc ( fpr , tpr ) pl . plot ( fpr , tpr , label = ' %s ROC (area = %0.2f )' % ( 'KNeighborsClassifier' , roc_auc )) logreg_result = log_reg . fit ( trn_train , trg_train ) . predict_proba ( trn_test ) fpr , tpr , thresholds = roc_curve ( trg_test , logreg_result [:, 1 ]) roc_auc = auc ( fpr , tpr ) pl . plot ( fpr , tpr , label = ' %s ROC (area = %0.2f )' % ( 'LogisticRegression' , roc_auc )) pl . plot ([ 0 , 1 ], [ 0 , 1 ], 'k--' ) pl . xlim ([ 0.0 , 1.0 ]) pl . ylim ([ 0.0 , 1.0 ]) pl . xlabel ( 'False Positive Rate' ) pl . ylabel ( 'True Positive Rate' ) pl . legend ( loc = 0 , fontsize = 'small' ) pl . show () In [ ]:","tags":"posts","url":"/first-post.html","loc":"/first-post.html"},{"title":"Air Quality Notebook","text":"In [ ]: import pandas as pd import numpy as np import matplotlib.pyplot as plt import seaborn as sns In [ ]: df = pd . read_csv ( \"Airquality.csv\" , encoding = \"ISO-8859-1\" ) In [147]: df . head () Out[147]: stn_code sampling_date state location agency type so2 no2 rspm spm location_monitoring_station pm2_5 date 0 150 February - M021990 Andhra Pradesh Hyderabad NaN Residential, Rural and other Areas 4.8 17.4 NaN NaN NaN NaN 1990-02-01 1 151 February - M021990 Andhra Pradesh Hyderabad NaN Industrial Area 3.1 7.0 NaN NaN NaN NaN 1990-02-01 2 152 February - M021990 Andhra Pradesh Hyderabad NaN Residential, Rural and other Areas 6.2 28.5 NaN NaN NaN NaN 1990-02-01 3 150 March - M031990 Andhra Pradesh Hyderabad NaN Residential, Rural and other Areas 6.3 14.7 NaN NaN NaN NaN 1990-03-01 4 151 March - M031990 Andhra Pradesh Hyderabad NaN Industrial Area 4.7 7.5 NaN NaN NaN NaN 1990-03-01 In [148]: df . isnull () . sum () Out[148]: stn_code 144077 sampling_date 3 state 0 location 3 agency 149481 type 5393 so2 34646 no2 16233 rspm 40222 spm 237387 location_monitoring_station 27491 pm2_5 426428 date 7 dtype: int64 In [149]: df . dtypes Out[149]: stn_code object sampling_date object state object location object agency object type object so2 float64 no2 float64 rspm float64 spm float64 location_monitoring_station object pm2_5 float64 date object dtype: object In [150]: df [ 'date' ] = pd . to_datetime ( df [ 'date' ]) In [151]: df . head () Out[151]: stn_code sampling_date state location agency type so2 no2 rspm spm location_monitoring_station pm2_5 date 0 150 February - M021990 Andhra Pradesh Hyderabad NaN Residential, Rural and other Areas 4.8 17.4 NaN NaN NaN NaN 1990-02-01 1 151 February - M021990 Andhra Pradesh Hyderabad NaN Industrial Area 3.1 7.0 NaN NaN NaN NaN 1990-02-01 2 152 February - M021990 Andhra Pradesh Hyderabad NaN Residential, Rural and other Areas 6.2 28.5 NaN NaN NaN NaN 1990-02-01 3 150 March - M031990 Andhra Pradesh Hyderabad NaN Residential, Rural and other Areas 6.3 14.7 NaN NaN NaN NaN 1990-03-01 4 151 March - M031990 Andhra Pradesh Hyderabad NaN Industrial Area 4.7 7.5 NaN NaN NaN NaN 1990-03-01 In [152]: corr = df . corr () corr Out[152]: so2 no2 rspm spm pm2_5 so2 1.000000 0.340555 0.165325 0.148325 0.035980 no2 0.340555 1.000000 0.369923 0.326170 0.509357 rspm 0.165325 0.369923 1.000000 0.801752 0.754709 spm 0.148325 0.326170 0.801752 1.000000 NaN pm2_5 0.035980 0.509357 0.754709 NaN 1.000000 In [153]: df = df . drop ( columns = [ \"stn_code\" , \"sampling_date\" , \"agency\" , \"location_monitoring_station\" ], axis = 1 ) In [154]: df . head () Out[154]: state location type so2 no2 rspm spm pm2_5 date 0 Andhra Pradesh Hyderabad Residential, Rural and other Areas 4.8 17.4 NaN NaN NaN 1990-02-01 1 Andhra Pradesh Hyderabad Industrial Area 3.1 7.0 NaN NaN NaN 1990-02-01 2 Andhra Pradesh Hyderabad Residential, Rural and other Areas 6.2 28.5 NaN NaN NaN 1990-02-01 3 Andhra Pradesh Hyderabad Residential, Rural and other Areas 6.3 14.7 NaN NaN NaN 1990-03-01 4 Andhra Pradesh Hyderabad Industrial Area 4.7 7.5 NaN NaN NaN 1990-03-01 In [155]: print ( pd . __name__ , pd . __version__ ) pandas 0.23.4 In [156]: df . dtypes Out[156]: state object location object type object so2 float64 no2 float64 rspm float64 spm float64 pm2_5 float64 date datetime64[ns] dtype: object In [157]: df [ 'year' ] = pd . DatetimeIndex ( df [ 'date' ]) . year df [ 'year' ] = pd . to_numeric ( df [ 'year' ], downcast = 'signed' ) # # df['Year']=[d.split('-')[0] for d in df['date']] # # #df = df.drop(columns=['date'],axis=1) # df['date'] = pd.to_datetime(df['date']) df . head () Out[157]: state location type so2 no2 rspm spm pm2_5 date year 0 Andhra Pradesh Hyderabad Residential, Rural and other Areas 4.8 17.4 NaN NaN NaN 1990-02-01 1990.0 1 Andhra Pradesh Hyderabad Industrial Area 3.1 7.0 NaN NaN NaN 1990-02-01 1990.0 2 Andhra Pradesh Hyderabad Residential, Rural and other Areas 6.2 28.5 NaN NaN NaN 1990-02-01 1990.0 3 Andhra Pradesh Hyderabad Residential, Rural and other Areas 6.3 14.7 NaN NaN NaN 1990-03-01 1990.0 4 Andhra Pradesh Hyderabad Industrial Area 4.7 7.5 NaN NaN NaN 1990-03-01 1990.0 Handling missing data with Sklearn Impute In [158]: from sklearn.preprocessing import Imputer impute_features = [ 'so2' , 'no2' , 'rspm' , 'spm' , 'pm2_5' ] imputer = Imputer ( missing_values = 'NaN' , strategy = 'mean' , axis = 0 ) imputer . fit ( df [ impute_features ]) print ( impute_features ) df [ impute_features ] = imputer . transform ( df [ impute_features ]) ['so2', 'no2', 'rspm', 'spm', 'pm2_5'] In [159]: impute_year = [ 'year' ] imputer = Imputer ( missing_values = 'NaN' , strategy = 'most_frequent' , axis = 0 ) imputer . fit ( df [ impute_year ]) print ( impute_year ) df [ impute_year ] = imputer . transform ( df [ impute_year ]) ['year'] In [160]: df . isnull () . sum () Out[160]: state 0 location 3 type 5393 so2 0 no2 0 rspm 0 spm 0 pm2_5 0 date 7 year 0 dtype: int64 In [ ]: Catogeriocal Imputing using sklearn-pandas module In [162]: from sklearn_pandas import CategoricalImputer cat_imputer = CategoricalImputer () cat_imputer . fit ( df [ 'type' ]) print ( cat_imputer . fill_ ) df [ 'type' ] = cat_imputer . transform ( df [ 'type' ]) Residential, Rural and other Areas In [163]: cat_imputer = CategoricalImputer () cat_imputer . fit ( df [ 'location' ]) print ( cat_imputer . fill_ ) df [ 'location' ] = cat_imputer . transform ( df [ 'location' ]) Guwahati In [164]: df . isnull () . sum () Out[164]: state 0 location 0 type 0 so2 0 no2 0 rspm 0 spm 0 pm2_5 0 date 7 year 0 dtype: int64 In [172]: plt . plot ( df [ 'state' ], df [ 'so2' ], label = 'so2' ) plt . xlabel ( '' ) plt . xticks ( rotation = 90 ) plt . legend ( loc = 'upper left' ) #plt.figure(figsize=(1,1)) plt . show () In [ ]: plt . bar ( df [ 'state' ], df [ 'no2' ], label = 'no2' ) plt . xlabel ( '' ) plt . xticks ( rotation = 90 ) plt . legend ( loc = 'upper left' ) plt . figure ( figsize = ( 50 , 20 )) #plt.figure(figsize=(1,1)) plt . show () In [166]: sns . lmplot ( x = 'year' , y = 'no2' , data = df ) plt . figure ( figsize = ( 18 , 8 )) plt . show () <Figure size 1296x576 with 0 Axes> In [52]: df . head () Out[52]: state location type so2 no2 rspm spm pm2_5 year 0 Andhra Pradesh Hyderabad Residential, Rural and other Areas 4.8 17.4 108.832784 220.78348 40.791467 1990.0 1 Andhra Pradesh Hyderabad Industrial Area 3.1 7.0 108.832784 220.78348 40.791467 1990.0 2 Andhra Pradesh Hyderabad Residential, Rural and other Areas 6.2 28.5 108.832784 220.78348 40.791467 1990.0 3 Andhra Pradesh Hyderabad Residential, Rural and other Areas 6.3 14.7 108.832784 220.78348 40.791467 1990.0 4 Andhra Pradesh Hyderabad Industrial Area 4.7 7.5 108.832784 220.78348 40.791467 1990.0 In [165]: pd . pivot_table ( df , index = [ 'year' ]) Out[165]: no2 pm2_5 rspm so2 spm year 1987.0 29.491222 40.791467 108.832784 18.897788 278.401290 1988.0 29.760823 40.791467 108.832784 20.093999 247.353570 1989.0 29.133041 40.791467 108.832784 18.315660 237.620273 1990.0 25.716276 40.791467 108.832784 17.467823 242.305362 1991.0 25.979130 40.791467 108.832784 17.175637 241.396689 1992.0 30.458832 40.791467 108.832784 17.051508 199.392171 1993.0 30.100067 40.791467 108.832784 21.582684 226.207455 1994.0 31.497093 40.791467 108.832784 21.902739 243.568709 1995.0 32.245832 40.791467 108.832784 23.784821 242.815737 1996.0 26.464032 40.791467 108.832784 20.118915 248.242864 1997.0 27.953251 40.791467 108.832784 20.077586 208.811998 1998.0 27.216228 40.791467 108.832784 19.371225 239.365472 1999.0 28.271167 40.791467 108.832784 19.546167 230.355851 2000.0 28.924933 40.791467 108.832784 16.724982 201.195539 2001.0 28.563771 40.791467 108.832784 15.016892 229.176596 2002.0 27.102435 40.791467 108.832784 13.095795 186.476986 2003.0 21.849922 40.791467 95.438979 6.908129 199.015948 2004.0 27.920846 40.791467 119.321672 11.458696 185.195995 2005.0 28.255984 40.791467 111.274511 12.485160 231.589923 2006.0 26.574794 40.791467 109.363718 11.234578 224.801833 2007.0 26.431608 40.791467 104.844632 11.505807 219.253792 2008.0 27.590737 40.791467 112.707609 11.193318 229.767044 2009.0 25.984429 40.791467 114.120319 10.746522 234.414305 2010.0 26.781211 40.791467 110.548384 10.102998 231.668286 2011.0 28.155290 40.791467 115.716189 11.191143 211.087735 2012.0 24.779108 40.791467 109.996489 10.896091 220.783480 2013.0 22.306690 40.791467 107.506982 9.315736 209.579022 2014.0 24.434144 40.605412 103.334382 9.161688 220.783480 2015.0 23.627530 40.954929 100.977941 8.483034 220.783480 In [ ]:","tags":"posts","url":"/airQuality.html","loc":"/airQuality.html"}]};