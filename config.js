/*
 * Frontend configuration.
 * For deployment, set API_BASE_OVERRIDE to the absolute HTTPS URL of the STARMUSICS API.
 * Leave it empty for local development on localhost:8787.
 */
(function configureSTARMUSICS(root) {
  'use strict';
  const API_BASE_OVERRIDE = '';
  const localHosts = ['localhost', '127.0.0.1', '::1'];
  const injected = typeof root.STARMUSICS_API_BASE === 'string' ? root.STARMUSICS_API_BASE : '';
  const configured = API_BASE_OVERRIDE || injected;
  root.STARMUSICS_API_BASE = configured || (localHosts.includes(root.location?.hostname) ? `${root.location.protocol}//${root.location.hostname}:8787` : '');
})(window);
