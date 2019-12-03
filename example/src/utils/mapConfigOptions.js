
import { 
    interpolateReds, schemeReds, 
    interpolateBlues, schemeBlues,
    interpolateBrBG, schemeBrBG, 
    interpolatePRGn, schemePRGn,
    interpolateRdGy, schemeRdGy
} from 'd3';

import {
    scaleSequentialQuantile,
    scaleQuantile
} from 'd3'

const cityTypes = [
    'Municipiu reședință de județ', 
    'Municipiu, altul decât reședința de județ',
    'Oraș',
]

const countyIds = [
    'AB', 'AG', 'AR', 'B', 'BC', 'BH', 'BN', 'BR', 'BT', 'BV', 'BZ',
    'CJ', 'CL', 'CS', 'CT', 'CV', 'DB', 'DJ', 'GJ', 'GL', 'GR', 'HD',
    'HR', 'IF', 'IL', 'IS', 'MH', 'MM', 'MS', 'NT', 'OT', 'PH', 'SB',
    'SJ', 'SM', 'SV', 'TL', 'TM', 'TR', 'VL', 'VN', 'VS'
]

const cities = [
    'Adjud', 'Alba Iulia', 'Alexandria', 'Amara', 'Aninoasa', 'Arad',
    'Bacău', 'Baia Mare', 'Bechet', 'Beclean', 'Beiuș', 'Berești',
    'Bicaz', 'Bistrița', 'Bolintin-Vale', 'Botoșani', 'Brașov',
    'Broșteni', 'Brăila', 'București', 'Buftea', 'Buzău', 'Bîrlad',
    'Băile Tușnad', 'Bălcești', 'Calafat', 'Caracal', 'Caransebeș',
    'Carei', 'Cluj-Napoca', 'Constanța', 'Corabia', 'Costești',
    'Craiova', 'Curtea de Argeș', 'Câmpia Turzii', 'Câmpina',
    'Călărași', 'Deta', 'Deva', 'Dorohoi', 'Drobeta-Turnu Severin',
    'Drăgășani', 'Fetești', 'Flămânzi', 'Focșani', 'Fundulea',
    'Galați', 'Giurgiu', 'Huedin', 'Hârșova', 'Iași', 'Isaccea',
    'Lugoj', 'Medgidia', 'Mediaș', 'Miercurea Ciuc', 'Moldova Nouă',
    'Moreni', 'Motru', 'Murgeni', 'Negrești-Oaș', 'Nădlac', 'Odobești',
    'Odorheiu Secuiesc', 'Oltenița', 'Onești', 'Oradea', 'Orșova',
    'Pașcani', 'Piatra-Neamț', 'Pitești', 'Ploiești', 'Podu Iloaiei',
    'Pogoanele', 'Predeal', 'Reșița', 'Roman', 'Roșiori de Vede',
    'Râmnicu Sărat', 'Râmnicu Vâlcea', 'Satu Mare', 'Sebeș',
    'Sfîntu Gheorghe', 'Sibiu', 'Sighetu Marmației', 'Sighișoara',
    'Slatina', 'Slobozia', 'Slănic-Moldova', 'Suceava',
    'Sângeorgiu de Pădure', 'Săcele', 'Tecuci', 'Timișoara', 'Titu',
    'Tulcea', 'Turceni', 'Târgu Secuiesc', 'Tîrgoviște', 'Tîrgu Jiu',
    'Tîrgu Mureș', 'Tălmaciu', 'Ulmeni', 'Urlați', 'Vaslui',
    'Vatra Dornei', 'Vașcău', 'Vulcan', 'Vînju Mare', 'Zalău',
    'Zimnicea', 'Zlatna', 'Însurăței', 'Întorsura Buzăului',
    'Șimleu Silvaniei'
]

const colors = [
    { label: 'Reds', interpolator: interpolateReds, scheme: schemeReds[9] },
    { label: 'Blues', interpolator: interpolateBlues, scheme: schemeBlues[9] },
    { label: 'BrBG', interpolator: interpolateBrBG, scheme: schemeBrBG[9] },
    { label: 'PrGN', interpolator: interpolatePRGn, scheme: schemePRGn[9] },
    { label: 'RdGy', interpolator: interpolateRdGy, scheme: schemeRdGy[9] }
]

const scales = [
    { label: 'Quantile', scale: scaleQuantile, colorType: 'scheme' },
    { label: 'Sequential Quantile',  scale: scaleSequentialQuantile, colorType: 'interpolator' },
]

export { scales, colors, countyIds, cities, cityTypes }
