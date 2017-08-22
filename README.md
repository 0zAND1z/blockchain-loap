# LOAP - A Versioned Auditing tool based on the MerkleDAG and a Blockchain

![LOAP](.readme/loap.gif)


The goal of our project is to combine two main technologies and provide a
versioned structure to publish files for later auditing.

This repository contains documents and the code used during and after the
[Blockchain Summer School 2017 in Copenhagen](http://blockchainschool.eu/)
(and hackathon). This solution has been developed by the Group 1 assigned on the
Maersk use case number 1.

## Problem
When files are modified in a chain of changes by a set of untrusted entities,
a lot of errors may happen, making an invalid end result. Most of those errors
are caused by Human mistakes or data corruption/inconsistency.

## Proposal
We propose a modular solution that can be easily integrate in existing workflows
to reduce the human error when transfering data and ensure consistency and
immutability over the content that is manipulated in each step of the chain.

The solution is designed so that every time new data is modified, a new
MarkleDAG is created. This structure includes:

 * The hash of to **Previous structure/version** (or input of the process)
 * The hash of to the **Original structure/version**
 * All the hash of the files added/modified.

By using the MerkleDAG and the hash as address of immutable content, we can
navigate between versions and obtain a chain of changes. As a version
is addressed by a single hash and linked with the other versions, we allow
auditors to easily identify what was changed in one single step of the chain
of changes.

By using symmetric cryptography and a PKI to manage authorization, we can easily
publish in a Blockchain the hashes of the MerkleDAG. The public key used will
allow the auditors to identify and validate who applied changes.

By using a Blockchain that uses hashes of symmetric keys to identify entities,
we can use the first MerkleDAG hash generated in the chain as a way to track
statuses and updates of the chain of changes.

## PoC implementation
The project is using [IPFS](https://ipfs.io/) and
[Ethereum](https://ethereum.org) blockchain to provide a decentralized solution
for multiple parties to: distribute, obtain an validate the changes applied to
files and documents.

Using a blockchain to store also the data is too expensive in terms of fees per
transaction, as existing database and cloud storage solution are not providing
an immutable, content-addressed, decentralised storage solution.

## How to run the PoC

* `npm install` or `yarn`
* `npm run dev`


## Contacts and Contributors
The main partecipant of hackathon that developed this idea are:

* [Stefan Seebacher](https://www.linkedin.com/in/stefan-seebacher/)
* [Eric Holst](https://www.linkedin.com/in/eric-holst-36343824/)
* [Visa Vallivaara](https://www.linkedin.com/in/visa-vallivaara-859059b0/)
* [Lorenzo Setale](https://setale.me/)


