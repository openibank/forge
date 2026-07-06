#!/usr/bin/env bash
set -euo pipefail

DNS_NAME="${FORGE_DNS_NAME:-${CREDITFORGE_DNS_NAME:-forge.creditchain.org}}"
ZONE_NAME="${FORGE_ZONE_NAME:-${CREDITFORGE_ZONE_NAME:-creditchain.org.}}"
RECORD_TYPE="${FORGE_DNS_TYPE:-${CREDITFORGE_DNS_TYPE:-CNAME}}"
TTL="${FORGE_DNS_TTL:-${CREDITFORGE_DNS_TTL:-300}}"
default_target() {
  if [ "$DNS_NAME" = "forge.creditchain.org" ]; then
    printf '%s\n' "openibank.github.io"
  else
    printf '%s\n' "maple3.duckdns.org"
  fi
}

TARGET="${FORGE_DNS_TARGET:-${CREDITFORGE_DNS_TARGET:-$(default_target)}}"
HOSTED_ZONE_ID="${FORGE_HOSTED_ZONE_ID:-${CREDITFORGE_HOSTED_ZONE_ID:-}}"
AWS_PROFILE_NAME="${AWS_PROFILE:-${FORGE_AWS_PROFILE:-${CREDITFORGE_AWS_PROFILE:-}}}"

aws_cli() {
  if [ -n "$AWS_PROFILE_NAME" ]; then
    aws --profile "$AWS_PROFILE_NAME" "$@"
  else
    aws "$@"
  fi
}

if ! command -v aws >/dev/null 2>&1; then
  echo "AWS CLI is not installed. Install awscli v2, authenticate, then rerun this script." >&2
  exit 2
fi

if ! aws_cli sts get-caller-identity >/dev/null 2>&1; then
  echo "AWS CLI is installed but no usable credentials are active." >&2
  echo "Run aws login, aws configure sso, or export AWS_PROFILE/FORGE_AWS_PROFILE, then rerun." >&2
  exit 2
fi

if [ -z "$TARGET" ]; then
  echo "FORGE_DNS_TARGET is required, for example openibank.github.io, maple3.duckdns.org, a Vercel, CloudFront, or load-balancer hostname." >&2
  exit 2
fi

if [ -z "$HOSTED_ZONE_ID" ]; then
  HOSTED_ZONE_ID="$(
    aws_cli route53 list-hosted-zones-by-name \
      --dns-name "$ZONE_NAME" \
      --query "HostedZones[?Name=='$ZONE_NAME'].Id | [0]" \
      --output text | sed 's#/hostedzone/##'
  )"
fi

if [ -z "$HOSTED_ZONE_ID" ] || [ "$HOSTED_ZONE_ID" = "None" ]; then
  echo "Could not find hosted zone for $ZONE_NAME. Set FORGE_HOSTED_ZONE_ID explicitly." >&2
  exit 2
fi

change_batch="$(mktemp)"
trap 'rm -f "$change_batch"' EXIT

cat > "$change_batch" <<JSON
{
  "Comment": "Forge public launch DNS for ${DNS_NAME}",
  "Changes": [
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "${DNS_NAME}",
        "Type": "${RECORD_TYPE}",
        "TTL": ${TTL},
        "ResourceRecords": [
          { "Value": "${TARGET}" }
        ]
      }
    }
  ]
}
JSON

aws_cli route53 change-resource-record-sets \
  --hosted-zone-id "$HOSTED_ZONE_ID" \
  --change-batch "file://$change_batch" \
  --query "ChangeInfo.{Id:Id,Status:Status,SubmittedAt:SubmittedAt}" \
  --output table

echo "Requested Route 53 UPSERT for ${DNS_NAME} -> ${TARGET}."
