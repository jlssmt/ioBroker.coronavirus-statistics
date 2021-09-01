const fs = require('fs');

const rkiStates = [
	'rkiImpfungenGesamtVerabreicht',
	'rkiErstimpfungenKumulativ',
	'rkiErstimpfungenBioNTech',
	'rkiErstimpfungenModerna',
	'rkiErstimpfungenAstraZeneca',
	'rkiErstimpfungenDifferenzVortag',
	'rkiErstimpfungenImpfquote',
	'rkiZweitimpfungenKumulativ',
	'rkiZweitimpfungenBioNTech',
	'rkiZweitimpfungenModerna',
	'rkiZweitimpfungenAstraZeneca',
	'rkiZweitimpfungenDifferenzVortag',
	'rkiZweitimpfungenImpfquote',
	'rkiImpfungenProTausend',
	'rkiDifferenzVortag',
	'rkiIndikationAlter',
	'rkiIndikationBeruf',
	'rkiIndikationMedizinisch',
	'rkiImpfungePflegeheim',
];
const impfungenRegex = new RegExp('.*_Impfungen\\.(' + rkiStates.join('|') + ')');

async function cleanupOldStatesFromPreviousImplementation(getAdapterObjectAsync, delObjectAsync, getObjectViewAsync, deleteUnused, deleteUnusedTimespan = 7) {
	if (!deleteUnused) return;

	const adapterData = await getAdapterObjectAsync();

	for (const key in adapterData) {
		if (adapterData[key].type !== 'state') {
			// console.log(await getObjectViewAsync(key, 'state'));
		}
		if (
			key.match(impfungenRegex)
			|| key.includes('Germany._Impfungen')
			|| (deleteUnused && adapterData[key].type === 'state' && getDayDifferenceOfDates(new Date(), new Date(adapterData[key].ts)) > deleteUnusedTimespan)	// delete every state updated earlier than x days in the past
		) {
			await delObjectAsync(key, {recursive: true});
		}
	}

const initial = [];

for (const key in adapterData) {
	initial.push({key, type: adapterData[key].type});
}

const result = initial.filter(item => {
	if (item.type === 'state') return false;
	return initial.filter(item2 => item2.key.includes(item.key)).length < 2;
});

for (const itemToDelete of result) {
	await delObjectAsync(itemToDelete.key);
}
}

function getDayDifferenceOfDates(date1, date2) {
	return Math.ceil(Math.abs(date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
}

module.exports = {cleanupOldStatesFromPreviousImplementation};
