# Aufgabenstellung
Umsetzung der Aufgabe mit einem vorgegebenen Projekt in diesem Repository
Dokumentation (High Level) der Projektumsetzung

## Anforderungen
Folgende Anforderungen müssen erfüllt werden:

- [ ] Anlage eines automatischen Builds der bei jedem Pull-Request in den Main läuft und auch bei jedem Push in den Main Branch selbst.
- [ ] Erstellen eines Docker Containers bei jedem Push in den Main Branch. Dieser Container muss mit einem Tag z.B.: Versionsnummer versehen in eine Container Registry hochgeladen werden. Der Container muss gehärtet sein, d.h.: Das Image soll keine bzw. möglichst wenige unnötigen Tools oder Abhängigkeiten beinhalten (Stichwort: Minimal oder Distroless Container).
- [ ] Erweitere die Pipeline um einen weiteren eigenständigen Step der das Dockerimage hinsichtlich Security analysiert. Beispielsweise mit Trivy, Grype, …
- [ ] Anlage von mindestens 3 Unit Tests und 2 Integrationstests. Achtung: Für die UnitTests könnte es erforderlich sein das die Applikation faktorisiert wird.
- [ ] Aufnahme der Tests in den Build für jeden Pull-Request in den Main Branch sowie bei jedem Push in den Main Branch selbst.
- [ ] Erweiterung der automatischen Tests durch einen Test Coverage-Report der als Artefakt abgelegt wird. Diese soll Teil des gleichen Build-Steps wie die Tests selbst sein.
- [ ] Installation und Konfiguration (beliebige Konfiguration von jenen die bei der Installation vorgeschlagen werden) von ESLint für das Projekt.
- [ ] Aufnahme von ESLint in den Build bei jedem Pull-Request in den Main Branch. Ebenso muss dies als Quality-Gate konfiguriert werden.
- [x] Konfiguration eines Automatismus zum Update von Fremdkomponenten, wenn es eine neue Version gibt (z.B.: snyk, Dependabot, …)
- [x] Konfiguration von Statischer Code Analyse inklusive Quality Gate(s). Diese sollen auch bei jedem Pull-Request in den Main Branch ausgeführt werden.
- [ ] Legt abschließend einen Pull-Request mit einer trivialen Änderung an damit man die zuvor konfigurierten Quality Gates sehen kann.
