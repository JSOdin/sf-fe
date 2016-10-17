(function(){
    'use strict';

    angular.module('myapp').factory('selectoptions',[SelectOptions]);

    function SelectOptions(){

        /** user search form options **/
        var countries = ['Afghanistan', 'Åland Islands', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bangladesh', 'Barbados', 'Bahamas', 'Bahrain', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'British Indian Ocean Territory', 'British Virgin Islands', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burma', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Congo-Brazzaville', 'Congo-Kinshasa', 'Cook Islands', 'Costa Rica', '$_[', 'Croatia', 'Curaçao', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'El Salvador', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Federated States of Micronesia', 'Fiji', 'Finland', 'France', 'French Guiana', 'French Polynesia', 'French Southern Lands', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Heard and McDonald Islands', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn Islands', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Réunion', 'Romania', 'Russia', 'Rwanda', 'Saint Barthélemy', 'Saint Helena', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Martin', 'Saint Pierre and Miquelon', 'Saint Vincent', 'Samoa', 'San Marino', 'São Tomé and Príncipe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Sint Maarten', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Georgia', 'South Korea', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Svalbard and Jan Mayen', 'Sweden', 'Swaziland', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Vietnam', 'Venezuela', 'Wallis and Futuna', 'Western Sahara', 'Yemen', 'Zambia', 'Zimbabwe'];

        var languages = ["Bulgarian", "Chinese", "Croatian", "Czech", "Danish", "Dutch", "English",
            "Estonian", "Finnish", "French","German","Greek","Hebrew","Hungarian","Indonesian","Italian","Japanese", "Korean","Latvian","Lithuanian","Norwegian","Polish","Portuguese","Romanian","Russian","Serbian",
            "Slovak","Slovenian","Spanish","Swedish","Turkish","Ukranian","Vietnamese"];

        var serverregions = ["Australia","Dubai","South Korea","Japan","Chile","Peru","India","China","Russia","Europe East","Europe West","US East","US West"];

        var ages = ["35+","31-35","26-30","21-25","15-20",'10-14'];

        /** dota 2 form options **/

        var dotamatchmaking = ["Bots Matchmaking", "Custom Games", "Ranked Matchmaking","Normal Matchmaking"];

        var solommrs = ["Unranked","Below 1000", "1000-1500","1500-2000","2000-2500", "2500-3000", "3000-3500","3500-4000","4000-4500","4500-5000", "5000-5500","5500-6000","6000-6500","6500-7000","7000+"];

        var partymmrs = ["Unranked","Below 1000", "1000-1500","1500-2000","2000-2500", "2500-3000", "3000-3500","3500-4000","4000-4500","4500-5000", "5000-5500","5500-6000","6000-6500","6500-7000","7000+"];


        var positions = ["#1 - hard carry", "#2 - mid/secondary carry", "#3 - offlane/misc role", "#4 - secondary support", "#5 - hard support"];

        /** csgo form options **/


        var csgomatchmaking = ["Casual","League","Matchmaking","Competitive PUGs"];

        var csgoroles = ["Leader / Strat caller","Entry fragger", "AWP","Lurker","Support","Rifler"];

        var csgoranks = ["Unranked","Silver I","Silver II","Silver III","Silver IV","Silver Elite","Silver Elite Master","Gold Nova I","Gold Nova II", "Gold Nova III","Gold Nova Master","Master Guardian I","Master Guardian II","Master Guardian Elite","Distinguished Master Guardian","Legendary Eagle","Legendary Eagle Master","Supreme Master First Class","The Global Elite"];

        var howlongs = ["Less than 1month", "1-6 months","6-12 months", "1-3 years","3-6years","More than 6 years"];






        var communications = ["In game voice", "Skype", "Teamspeak", "Raidcall", "Ventrilo", "Mumble", "None", 'Discord'];



        /** user initial signup options **/

        var genres = ["First person shooter","Action Real Time Strategy", "Action","Indie","Adventure","Strategy","RPG","Simulation","Casual","Free to Play", "Singleplayer","Massively Multiplayer","Racing","Sports","Open World"];

        var intents = ["Casual play", "Someone to practice with", "Competitive play", "Seriously competitive"];

        var teams = ["Yes","No"];

        var genders = ["Male","Female"];

        var regions = ["NA West", "NA Central","NA East", "SA West", "SA Central", "SA East","EU West", "EU Central" , "EU North", "EU East", "EU South", 'EU (ALL)',"AU", "Southeast Asia", "East Asia", "Central Asia","South Asia"];

        return {
            countries: countries,
            languages: languages,
            serverregions: serverregions,
            ages: ages,
            dotamodes: dotamatchmaking,
            csgomodes: csgomatchmaking,
            solommrs: solommrs,
            partymmrs: partymmrs,
            csgoranks:csgoranks,
            csgoroles : csgoroles,
            communications: communications,
            dotaroles : positions,
            genres:genres,
            intents: intents,
            genders: genders,
            regions: regions,
            teams: teams,
            howlongs : howlongs
        }
    }
})();