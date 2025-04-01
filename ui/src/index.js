import * as React from 'react';
import { useMemo, useState } from 'react';
import yaml from 'js-yaml';
import './index.css';

((window) => {
  const { createElement, useEffect } = React;

  const PRESETS = {
    'Quick (20%, 50%)': [
      { setWeight: 20 },
      { pause: { duration: '30s' } },
      { setWeight: 50 },
      { pause: { duration: '1m' } },
    ],
    'Slow (10%, 30%, 50%)': [
      { setWeight: 10 },
      { pause: { duration: '1m' } },
      { setWeight: 30 },
      { pause: { duration: '2m' } },
      { setWeight: 50 },
      { pause: { duration: '3m' } },
    ],
    'Full (10% → 100%)': [
      { setWeight: 10 },
      { pause: { duration: '1m' } },
      { setWeight: 30 },
      { pause: { duration: '2m' } },
      { setWeight: 50 },
      { pause: { duration: '2m' } },
      { setWeight: 100 },
    ],
  };

  const convertDeploymentToRollout = (deployment, steps) => {
    if (!deployment || deployment.kind !== 'Deployment') return null;

    const {
      metadata,
      spec: {
        replicas,
        selector,
        template,
        revisionHistoryLimit,
        progressDeadlineSeconds,
        minReadySeconds,
      },
    } = deployment;

    return {
      apiVersion: 'argoproj.io/v1alpha1',
      kind: 'Rollout',
      metadata,
      spec: {
        replicas,
        selector,
        template,
        strategy: {
          canary: { steps },
        },
        revisionHistoryLimit,
        progressDeadlineSeconds,
        minReadySeconds,
      },
    };
  };

  const CopyButton = ({ text }) =>
    createElement(
      'button',
      {
        className: 'copy-btn',
        onClick: async () => {
          try {
            await navigator.clipboard.writeText(text);
            alert('YAML copied to clipboard!');
          } catch (err) {
            alert('Failed to copy YAML.');
          }
        },
      },
      'Copy YAML'
    );

  const DeploymentYamlViewer = ({ resource }) => {
    const [presetName, setPresetName] = useState('Quick (20%, 50%)');

    const liveYaml = useMemo(() => {
      if (!resource) return '# No live resource available';
      try {
        return yaml.dump(resource);
      } catch {
        return '# Error converting live resource to YAML';
      }
    }, [resource]);

    const rolloutYaml = useMemo(() => {
      try {
        const rollout = convertDeploymentToRollout(resource, PRESETS[presetName]);
        return rollout ? yaml.dump(rollout) : '# Could not convert Deployment to Rollout';
      } catch {
        return '# Error converting Deployment to Rollout';
      }
    }, [resource, presetName]);

    return createElement('div', { className: 'container' }, [
      createElement('div', { className: 'block' }, [
        createElement('h3', {}, 'Live Deployment YAML'),
        createElement(CopyButton, { text: liveYaml }),
        createElement('pre', { className: 'yaml-box' }, liveYaml),
      ]),
      createElement('div', { className: 'block' }, [
        createElement('h3', {}, 'Converted Rollout YAML'),
        createElement(
          'div',
          { className: 'preset-select' },
          createElement(
            'select',
            {
              value: presetName,
              onChange: (e) => setPresetName(e.target.value),
            },
            Object.keys(PRESETS).map((key) =>
              createElement('option', { key, value: key }, key)
            )
          )
        ),
        createElement(CopyButton, { text: rolloutYaml }),
        createElement('pre', { className: 'yaml-box' }, rolloutYaml),
      ]),
    ]);
  };

  window.extensionsAPI?.registerResourceExtension?.(
    DeploymentYamlViewer,
    'apps',
    'Deployment',
    'Rollout Convert'
  );
})(window);