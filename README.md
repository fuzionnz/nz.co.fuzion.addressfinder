Archived - shifted to https://lab.civicrm.org/extensions/addressfinder

# Address Finder for CiviCRM Address fields.

![Screenshot](/images/addressfinder.png)

Uses https://addressfinder.nz/ API to list address for CiviCRM Address fields.

The extension is licensed under [AGPL-3.0](LICENSE.txt).

## Requirements

* PHP v7.4+
* CiviCRM (*FIXME: Version number*)

## Installation (Web UI)

Learn more about installing CiviCRM extensions in the [CiviCRM Sysadmin Guide](https://docs.civicrm.org/sysadmin/en/latest/customize/extensions/).

## Installation (CLI, Zip)

Sysadmins and developers may download the `.zip` file for this extension and
install it with the command-line tool [cv](https://github.com/civicrm/cv).

```bash
cd <extension-dir>
cv dl nz.co.fuzion.addressfinder@https://github.com/FIXME/nz.co.fuzion.addressfinder/archive/master.zip
```
or
```bash
cd <extension-dir>
cv dl nz.co.fuzion.addressfinder@https://lab.civicrm.org/extensions/nz.co.fuzion.addressfinder/-/archive/main/nz.co.fuzion.addressfinder-main.zip
```

## Installation (CLI, Git)

Sysadmins and developers may clone the [Git](https://en.wikipedia.org/wiki/Git) repo for this extension and
install it with the command-line tool [cv](https://github.com/civicrm/cv).

```bash
git clone https://github.com/FIXME/nz.co.fuzion.addressfinder.git
cv en addressfinder
```
or
```bash
git clone https://lab.civicrm.org/extensions/nz.co.fuzion.addressfinder.git
cv en addressfinder
```

## Getting Started

- Enable the extension.
- Store the AddressFinder key in civicrm settings - `cv api Setting.create address_finder_key="XXX"`
- Load the contribution/event page having address fields. The Street Address field must have a placeholder `Start typing an address...`.
